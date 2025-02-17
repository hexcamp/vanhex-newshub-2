import { error } from '@sveltejs/kit';

import { simpleFetchHandler, XRPC, XRPCError } from '@atcute/client';
import type { AppBskyFeedDefs, AppBskyFeedGetPostThread, Records } from '@atcute/client/lexicons';
import { definite } from '@mary/array-fns';

import { PUBLIC_APPVIEW_URL, PUBLIC_CONSTELLATION_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { getPost } from '$lib/queries/post';
import { makeAtUri } from '$lib/types/at-uri';
import type { Did } from '$lib/types/identity';

export const load: PageLoad = async ({ url, params, fetch }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const parentUri = makeAtUri(params.actor, 'app.bsky.feed.post', params.rkey);

	// Fetch the parent post, but don't block.
	const postPromise = getPost({ rpc, uri: parentUri });
	void postPromise.catch(() => {});

	// Get links from Constellation
	const { cursor, linking_records } = await getLinks({
		uri: parentUri,
		collection: 'app.bsky.feed.post',
		path: '.reply.parent.uri',
		cursor: url.searchParams.get('cursor'),
	});

	// Hydrate the links
	const resolvedReplies = await Promise.all(
		linking_records.map(async (link) => {
			let data: AppBskyFeedGetPostThread.Output;
			try {
				const response = await rpc.get('app.bsky.feed.getPostThread', {
					params: {
						uri: makeAtUri(link.did, 'app.bsky.feed.post', link.rkey),
						depth: 3,
						parentHeight: 0,
					},
				});

				data = response.data;
			} catch (err) {
				if (err instanceof XRPCError) {
					// ignore if AppView says it's not found
					if (err.kind === 'NotFound') {
						return null;
					}
				}

				throw err;
			}

			const thread = data.thread;
			switch (thread.$type) {
				// same goes for this union
				case 'app.bsky.feed.defs#notFoundPost':
				case 'app.bsky.feed.defs#blockedPost': {
					return null;
				}
			}

			return thread;
		}),
	);

	const replies = definite(resolvedReplies);
	const { post: parentPost, threadgate } = await postPromise;

	const thread: AppBskyFeedDefs.ThreadViewPost = {
		post: parentPost,
		replies: replies,
	};

	return {
		cursor: cursor || undefined,
		thread: thread,
		threadgate,
	};
};

interface LinkResponse<K extends keyof Records> {
	total: number;
	cursor: string | null;
	linking_records: Array<{
		did: Did;
		collection: K;
		rkey: string;
	}>;
}

const getLinks = async <K extends keyof Records>({
	uri,
	collection,
	path,
	limit = 10,
	cursor = null,
}: {
	uri: string;
	collection: K;
	path: string;
	limit?: number;
	cursor?: string | null;
}): Promise<LinkResponse<K>> => {
	const requestUrl =
		`${PUBLIC_CONSTELLATION_URL}/links` +
		`?target=${encodeURIComponent(uri)}` +
		`&collection=${collection}` +
		`&path=${path}` +
		`&limit=${limit}` +
		(cursor ? `&cursor=${cursor}` : '');

	const response = await fetch(requestUrl);
	if (!response.ok) {
		error(503, `Constellation API returned ${response.status}`);
	}

	const json = await response.json();
	return json as LinkResponse<K>;
};
