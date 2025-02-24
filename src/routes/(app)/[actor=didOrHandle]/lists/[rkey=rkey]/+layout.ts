import { simpleFetchHandler, XRPC } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';

import { resolveHandle } from '$lib/queries/handle';
import { makeAtUri } from '$lib/types/at-uri';
import { isDid, type Did } from '$lib/types/identity';

export const load: LayoutLoad = async ({ url, route, params, fetch }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		did = await resolveHandle({ rpc, handle: params.actor });
	}

	const isListing = route.id === '/(app)/[actor=didOrHandle]/lists/[rkey=rkey]/members';
	const cursor = url.searchParams.get('cursor') || undefined;
	const { data } = await rpc.get('app.bsky.graph.getList', {
		params: {
			list: makeAtUri(did, 'app.bsky.graph.list', params.rkey),
			limit: isListing ? 50 : 1,
			cursor: isListing ? cursor : undefined,
		},
	});

	const view = data.list;

	return { list: view, members: { cursor: data.cursor, items: data.items } };
};
