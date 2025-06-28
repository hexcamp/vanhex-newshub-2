import type { AppBskyActorDefs } from '@atcute/bluesky';
import { Client, ok, simpleFetchHandler } from '@atcute/client';

import { PUBLIC_APP_URL, PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

import { buildTimelineSlices } from '$lib/models/timeline';
import { createRssFeed, feedPostToFeedItem } from '$lib/rss';
import { normalizeDisplayName } from '$lib/utils/bluesky/display';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const [profile, timeline] = await Promise.all([
		(async () => {
			const data = await ok(
				client.get('app.bsky.actor.getProfile', {
					params: {
						actor: params.actor,
					},
				}),
			);

			return data;
		})(),

		(async () => {
			const data = await ok(
				client.get('app.bsky.feed.getAuthorFeed', {
					params: {
						actor: params.actor,
						limit: 100,
						filter: 'posts_and_author_threads',
						includePins: false,
					},
				}),
			);

			// Build into slices so we can filter out non-self threads
			const slices = buildTimelineSlices(
				data.feed,
				(slice) => {
					// Skip any posts that doesn't look like a self thread

					const first = slice.items[0];
					const reply = first.reply;
					if (reply) {
						const { root, parent, grandparentAuthor } = reply;

						const authors: AppBskyActorDefs.ProfileViewBasic[] = [];

						if (root.$type === 'app.bsky.feed.defs#postView') {
							authors.push(root.author);
						}

						if (parent.$type === 'app.bsky.feed.defs#postView') {
							authors.push(parent.author);
						}

						if (grandparentAuthor) {
							authors.push(grandparentAuthor);
						}

						if (authors.some((author) => author.did !== first.post.author.did)) {
							return false;
						}

						return true;
					}

					return true;
				},
				(item) => {
					// Skip reposts
					const reason = item.reason;
					return !reason || reason.$type !== 'app.bsky.feed.defs#reasonRepost';
				},
			);

			return slices
				.flatMap((slice) => slice.items)
				.sort((a, b) => (a.post.indexedAt > b.post.indexedAt ? -1 : 1));
		})(),
	]);

	const rss = createRssFeed({
		meta: {
			title: normalizeDisplayName(profile.displayName ?? '') || `@${profile.handle}`,
			description: `Posts from @${profile.handle}`,
			pageUrl: `${PUBLIC_APP_URL}/${profile.did}`,
			rssUrl: `${PUBLIC_APP_URL}/${profile.did}/rss`,
			image: profile.avatar ? { src: profile.avatar } : undefined,
		},
		items: timeline.map(feedPostToFeedItem),
	});

	return new Response(rss, {
		headers: {
			'content-type': 'application/rss+xml; charset=utf-8',
			'cache-control': 'public, max-age=300', // 5 minutes
		},
	});
};
