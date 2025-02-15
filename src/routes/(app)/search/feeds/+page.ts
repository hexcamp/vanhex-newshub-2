import { simpleFetchHandler, XRPC } from '@atcute/client';

import { asString, useSearchParams } from '$lib/utils/search-params';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const [{ q, cursor }] = useSearchParams(url, {
		q: asString.withDefault(''),
		cursor: asString,
	});

	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const query = q.trim();
	const { data } = await rpc.get('app.bsky.unspecced.getPopularFeedGenerators', {
		params: {
			query: query,
			limit: 50,
			cursor: cursor || undefined,
		},
	});

	return {
		query,
		feeds: {
			cursor: data.cursor,
			items: data.feeds,
		},
	};
};
