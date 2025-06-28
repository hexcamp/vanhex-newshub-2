import { Client, ClientResponseError, simpleFetchHandler } from '@atcute/client';

import { asString, asStringUnion, useSearchParams } from '$lib/utils/search-params';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const [{ q, sort, cursor }] = useSearchParams(url, {
		q: asString.withDefault(''),
		sort: asStringUnion(['top', 'latest']).withDefault('top'),
		cursor: asString,
	});

	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const query = q.trim();
	if (query.length === 0) {
		return { query, posts: { cursor: undefined, items: [] } };
	}

	const response = await client.get('app.bsky.feed.searchPosts', {
		params: {
			q: query,
			limit: 50,
			sort: sort,
			cursor: cursor || undefined,
		},
	});

	if (!response.ok) {
		if (response.status === 403) {
			return { query, posts: { cursor: undefined, items: [] } };
		}

		throw new ClientResponseError(response);
	}

	const data = response.data;

	return { query, posts: { cursor: data.cursor, items: data.posts } };
};
