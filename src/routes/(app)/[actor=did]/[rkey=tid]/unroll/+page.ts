import { error } from '@sveltejs/kit';

import { simpleFetchHandler, XRPC } from '@atcute/client';
import type { AppBskyFeedDefs, Brand } from '@atcute/client/lexicons';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { makeAtUri } from '$lib/types/at-uri';

export const load: PageLoad = async ({ params }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let currentUri = makeAtUri(params.actor, 'app.bsky.feed.post', params.rkey);
	const items: AppBskyFeedDefs.ThreadViewPost[] = [];

	while (true) {
		const { data } = await rpc.get('app.bsky.feed.getPostThread', {
			params: {
				uri: currentUri,
				// The max is 1000, but the AppView only returns 10.
				depth: 1000,
				parentHeight: 0,
			},
		});

		switch (data.thread.$type) {
			case 'app.bsky.feed.defs#notFoundPost': {
				error(404, `Post not found`);
			}
			case 'app.bsky.feed.defs#blockedPost': {
				error(404, `Blocked post`);
			}
		}

		// Add the root thread
		if (items.length === 0) {
			items.push(data.thread);
		} else {
			items[items.length - 1] = data.thread;
		}

		// Walk through the thread tree structure
		let foundReply = false;
		while (true) {
			const tail = items[items.length - 1];
			if (!tail.replies) {
				break;
			}

			const replies = tail.replies.filter((reply): reply is Brand.Union<AppBskyFeedDefs.ThreadViewPost> => {
				if (reply.$type !== 'app.bsky.feed.defs#threadViewPost') {
					return false;
				}

				if (reply.post.author.did !== tail.post.author.did) {
					return false;
				}

				return true;
			});

			if (replies.length === 0) {
				break;
			}

			// Get earliest first
			replies.sort((a, b) => {
				const aIndexed = a.post.indexedAt;
				const bIndexed = b.post.indexedAt;

				if (aIndexed < bIndexed) {
					return -1;
				}
				if (aIndexed > bIndexed) {
					return 1;
				}

				return 0;
			});

			items.push(replies[0]);

			currentUri = replies[0].post.uri;
			foundReply = true;
		}

		// No further valid reply, break out of loop
		if (!foundReply) {
			break;
		}
	}

	return { posts: items.map((item) => item.post) };
};
