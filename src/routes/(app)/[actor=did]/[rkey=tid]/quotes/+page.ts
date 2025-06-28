import { Client, ok, simpleFetchHandler } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { makeAtUri } from '$lib/types/at-uri';

export const load: PageLoad = async ({ url, params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const uri = makeAtUri(params.actor, 'app.bsky.feed.post', params.rkey);

	const data = await ok(
		client.get('app.bsky.feed.getQuotes', {
			params: {
				uri,
				limit: 50,
				cursor: url.searchParams.get('cursor') || undefined,
			},
		}),
	);

	return { quotes: { cursor: data.cursor, items: data.posts } };
};
