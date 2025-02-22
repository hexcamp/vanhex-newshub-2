import { simpleFetchHandler, XRPC } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';

import { resolveHandle } from '$lib/queries/handle';
import { makeAtUri } from '$lib/types/at-uri';
import { isDid, type Did } from '$lib/types/identity';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		did = await resolveHandle({ rpc, handle: params.actor });
	}

	const { data } = await rpc.get('app.bsky.graph.getList', {
		params: {
			list: makeAtUri(did, 'app.bsky.graph.list', params.rkey),
			limit: 1,
		},
	});

	const view = data.list;

	return { list: view };
};
