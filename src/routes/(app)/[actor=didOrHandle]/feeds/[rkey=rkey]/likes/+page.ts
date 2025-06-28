import { Client, ok, simpleFetchHandler } from '@atcute/client';
import { isDid, type Did } from '@atcute/lexicons/syntax';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { makeAtUri } from '$lib/types/at-uri';

export const load: PageLoad = async ({ url, params, fetch, parent }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		const parentData = await parent();
		did = parentData.feed.creator.did as Did;
	}

	const data = await ok(
		client.get('app.bsky.feed.getLikes', {
			params: {
				uri: makeAtUri(did, 'app.bsky.feed.generator', params.rkey),
				limit: 50,
				cursor: url.searchParams.get('cursor') || undefined,
			},
		}),
	);

	return { likes: { cursor: data.cursor, items: data.likes.map((like) => like.actor) } };
};
