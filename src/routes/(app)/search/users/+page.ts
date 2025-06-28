import { Client, ok, simpleFetchHandler } from '@atcute/client';

import { asString, useSearchParams } from '$lib/utils/search-params';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const [{ q, cursor }] = useSearchParams(url, {
		q: asString.withDefault(''),
		cursor: asString,
	});

	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const query = q.trim();
	if (query.length === 0) {
		return { query, profiles: { cursor: undefined, items: [] } };
	}

	const data = await ok(
		client.get('app.bsky.actor.searchActors', {
			params: {
				q: query,
				limit: 50,
				cursor: cursor || undefined,
			},
		}),
	);

	return {
		query,
		profiles: {
			cursor: data.cursor,
			items: data.actors,
		},
	};
};
