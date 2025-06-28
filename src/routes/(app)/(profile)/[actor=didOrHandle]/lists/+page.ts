import { Client, ok, simpleFetchHandler } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const data = await ok(
		client.get('app.bsky.graph.getLists', {
			params: {
				actor: params.actor,
				limit: 50,
				cursor: url.searchParams.get('cursor') || undefined,
			},
		}),
	);

	return { lists: { cursor: data.cursor, items: data.lists } };
};
