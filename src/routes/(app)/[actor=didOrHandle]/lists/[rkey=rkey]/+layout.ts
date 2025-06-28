import { Client, ok, simpleFetchHandler } from '@atcute/client';
import type { Did } from '@atcute/lexicons';
import { isDid } from '@atcute/lexicons/syntax';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';

import { resolveHandle } from '$lib/queries/handle';
import { makeAtUri } from '$lib/types/at-uri';

export const load: LayoutLoad = async ({ url, route, params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		did = await resolveHandle({ client: client, handle: params.actor });
	}

	const isListing = route.id === '/(app)/[actor=didOrHandle]/lists/[rkey=rkey]/members';
	const cursor = url.searchParams.get('cursor') || undefined;

	const data = await ok(
		client.get('app.bsky.graph.getList', {
			params: {
				list: makeAtUri(did, 'app.bsky.graph.list', params.rkey),
				limit: isListing ? 50 : 1,
				cursor: isListing ? cursor : undefined,
			},
		}),
	);

	const view = data.list;

	return { list: view, members: { cursor: data.cursor, items: data.items } };
};
