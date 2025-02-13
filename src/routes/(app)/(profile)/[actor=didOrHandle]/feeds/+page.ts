import { simpleFetchHandler, XRPC } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, params, fetch }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const { data } = await rpc.get('app.bsky.feed.getActorFeeds', {
		params: {
			actor: params.actor,
			limit: 50,
			cursor: url.searchParams.get('cursor') || undefined,
		},
	});

	return { feeds: { cursor: data.cursor, items: data.feeds } };
};
