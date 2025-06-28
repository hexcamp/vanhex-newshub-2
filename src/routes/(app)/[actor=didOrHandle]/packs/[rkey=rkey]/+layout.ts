import { Client, ok, simpleFetchHandler } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';

import { makeAtUri } from '$lib/types/at-uri';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const data = await ok(
		client.get('app.bsky.graph.getStarterPack', {
			params: {
				starterPack: makeAtUri(params.actor, 'app.bsky.graph.starterpack', params.rkey),
			},
		}),
	);

	const view = data.starterPack;

	return { pack: view };
};
