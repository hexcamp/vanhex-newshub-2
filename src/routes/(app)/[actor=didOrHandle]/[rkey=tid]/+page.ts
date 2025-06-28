import type { AppBskyFeedGetPostThread } from '@atcute/bluesky';
import { Client, ClientResponseError, ok, simpleFetchHandler } from '@atcute/client';
import { isDid, type Did } from '@atcute/lexicons/syntax';

import { error } from '@sveltejs/kit';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { resolveHandle } from '$lib/queries/handle';
import { makeAtUri } from '$lib/types/at-uri';

export const load: PageLoad = async ({ params }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (!isDid(params.actor)) {
		try {
			did = await resolveHandle({ client: client, handle: params.actor });
		} catch (err) {
			if (err instanceof ClientResponseError) {
				switch (err.error) {
					case 'InvalidRequest': {
						error(404, `Account doesn't exist`);
					}
				}
			}

			throw err;
		}
	} else {
		did = params.actor;
	}

	const uri = makeAtUri(did, 'app.bsky.feed.post', params.rkey);

	let data: AppBskyFeedGetPostThread.$output;

	try {
		data = await ok(
			client.get('app.bsky.feed.getPostThread', {
				params: {
					uri: uri,
					depth: 4,
					parentHeight: 10,
				},
			}),
		);
	} catch (err) {
		if (err instanceof ClientResponseError) {
			switch (err.error) {
				case 'NotFound': {
					error(404, `Post not found`);
				}
			}
		}

		throw err;
	}

	const thread = data.thread;
	switch (thread.$type) {
		case 'app.bsky.feed.defs#notFoundPost': {
			error(404, `Post not found`);
		}
		case 'app.bsky.feed.defs#blockedPost': {
			// shouldn't happen?
			error(404, `Blocked post`);
		}
	}

	return { thread, threadgate: data.threadgate };
};
