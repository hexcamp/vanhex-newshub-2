import { Client, ok, simpleFetchHandler } from '@atcute/client';

import { AUTHENTICATED_FEEDS } from '$lib/constants';
import { asString, useSearchParams } from '$lib/utils/search-params';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { CanonicalResourceUri } from '@atcute/lexicons';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const [{ q, cursor }] = useSearchParams(url, {
		q: asString.withDefault(''),
		cursor: asString,
	});

	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const query = q.trim();
	const data = await ok(
		client.get('app.bsky.unspecced.getPopularFeedGenerators', {
			params: {
				query: query,
				limit: 50,
				cursor: cursor || undefined,
			},
		}),
	);

	let feeds = data.feeds;
	if (query.length === 0) {
		feeds = feeds.filter((feed) => !AUTHENTICATED_FEEDS.includes(feed.uri as CanonicalResourceUri));
	}

	return {
		query,
		feeds: {
			cursor: data.cursor,
			items: feeds,
		},
	};
};
