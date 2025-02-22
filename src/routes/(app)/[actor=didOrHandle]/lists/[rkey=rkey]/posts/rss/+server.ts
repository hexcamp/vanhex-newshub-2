import { simpleFetchHandler, XRPC } from '@atcute/client';

import { PUBLIC_APP_URL, PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

import { buildTimelineSlices } from '$lib/models/timeline';
import { resolveHandle } from '$lib/queries/handle';
import { createRssFeed, feedPostToFeedItem } from '$lib/rss';
import { makeAtUri } from '$lib/types/at-uri';
import { isDid, type Did } from '$lib/types/identity';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		did = await resolveHandle({ rpc, handle: params.actor });
	}

	const uri = makeAtUri(did, 'app.bsky.graph.list', params.rkey);

	const [list, timeline] = await Promise.all([
		(async () => {
			const { data } = await rpc.get('app.bsky.graph.getList', {
				params: {
					list: uri,
					limit: 1,
				},
			});

			return data.list;
		})(),

		(async () => {
			const { data } = await rpc.get('app.bsky.feed.getListFeed', {
				params: {
					list: uri,
					limit: 100,
				},
			});

			const slices = buildTimelineSlices(data.feed);

			return slices
				.flatMap((slice) => slice.items)
				.sort((a, b) => (a.post.indexedAt > b.post.indexedAt ? -1 : 1));
		})(),
	]);

	const rss = createRssFeed({
		meta: {
			title: list.name.trim(),
			description: `Posts from ${list.creator.handle}'s list`,
			pageUrl: `${PUBLIC_APP_URL}/${did}/lists/${params.rkey}/posts`,
			rssUrl: `${PUBLIC_APP_URL}/${did}/lists/${params.rkey}/posts/rss`,
			image: list.avatar ? { src: list.avatar } : undefined,
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
