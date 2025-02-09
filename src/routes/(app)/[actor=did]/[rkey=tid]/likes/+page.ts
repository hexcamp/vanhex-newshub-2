import { simpleFetchHandler, XRPC } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { makeAtUri } from '$lib/types/at-uri';

export const load: PageLoad = async ({ url, params, fetch }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const uri = makeAtUri(params.actor, 'app.bsky.feed.post', params.rkey);

	const { data } = await rpc.get('app.bsky.feed.getLikes', {
		params: {
			uri,
			limit: 50,
			cursor: url.searchParams.get('cursor') || undefined,
		},
	});

	return { likes: { cursor: data.cursor, items: data.likes.map((like) => like.actor) } };
};
