import type { AppBskyFeedDefs } from '@atcute/bluesky';
import { Client, ClientResponseError, simpleFetchHandler } from '@atcute/client';
import { definite } from '@mary/array-fns';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { getLinks } from '$lib/queries/constellation';
import { getPost } from '$lib/queries/post';
import { makeAtUri } from '$lib/types/at-uri';

export const load: PageLoad = async ({ url, params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const parentUri = makeAtUri(params.actor, 'app.bsky.feed.post', params.rkey);

	// Fetch the parent post, but don't block.
	const postPromise = getPost({ client, uri: parentUri });
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
			const response = await client.get('app.bsky.feed.getPostThread', {
				params: {
					uri: makeAtUri(link.did, 'app.bsky.feed.post', link.rkey),
					depth: 3,
					parentHeight: 0,
				},
			});

			if (!response.ok) {
				// AppView says not found, carry on
				if (response.data.error === 'NotFound') {
					return null;
				}

				throw new ClientResponseError(response);
			}

			const thread = response.data.thread;
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
