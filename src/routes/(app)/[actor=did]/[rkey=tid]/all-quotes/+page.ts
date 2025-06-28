import { Client, ok, simpleFetchHandler } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { getLinksMultiPath } from '$lib/queries/constellation';
import { makeAtUri } from '$lib/types/at-uri';

export const load: PageLoad = async ({ url, params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const parentUri = makeAtUri(params.actor, 'app.bsky.feed.post', params.rkey);

	const { cursor, linking_records } = await getLinksMultiPath({
		uri: parentUri,
		collection: 'app.bsky.feed.post',
		paths: ['.embed.record.uri', '.embed.record.record.uri'],
		cursor: url.searchParams.get('cursor'),
		limit: 25,
	});

	const items = await (async () => {
		const data = await ok(
			client.get('app.bsky.feed.getPosts', {
				params: {
					uris: linking_records.map((link) => makeAtUri(link.did, 'app.bsky.feed.post', link.rkey)),
				},
			}),
		);

		return data.posts;
	})();

	return { quotes: { cursor: cursor ?? undefined, items } };
};
