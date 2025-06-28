import { Client, ok, simpleFetchHandler } from '@atcute/client';
import { isDid, type Did } from '@atcute/lexicons/syntax';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';

import { resolveHandle } from '$lib/queries/handle';
import { makeAtUri } from '$lib/types/at-uri';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		did = await resolveHandle({ client: client, handle: params.actor });
	}

	const data = await ok(
		client.get('app.bsky.feed.getFeedGenerator', {
			params: {
				feed: makeAtUri(did, 'app.bsky.feed.generator', params.rkey),
			},
		}),
	);

	const view = data.view;

	return { feed: view };
};
