import { Client, ok, simpleFetchHandler } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch, parent }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const { pack } = await parent();

	// It shouldn't be missing, but oh well.
	if (!pack.list) {
		return { members: { cursor: undefined, items: [] } };
	}

	if (pack.listItemsSample) {
		if ((pack.list.listItemCount ?? 0) <= pack.listItemsSample.length) {
			return { members: { cursor: undefined, items: pack.listItemsSample } };
		}
	}

	const data = await ok(
		client.get('app.bsky.graph.getList', {
			params: {
				list: pack.list.uri,
				limit: 50,
				cursor: url.searchParams.get('cursor') || undefined,
			},
		}),
	);

	return { members: { cursor: data.cursor, items: data.items } };
};
