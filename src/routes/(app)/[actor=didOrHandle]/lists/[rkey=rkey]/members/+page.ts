import { simpleFetchHandler, XRPC } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { makeAtUri } from '$lib/types/at-uri';
import { isDid, type Did } from '$lib/types/identity';

export const load: PageLoad = async ({ url, params, fetch, parent }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		const parentData = await parent();
		did = parentData.list.creator.did as Did;
	}

	const { data } = await rpc.get('app.bsky.graph.getList', {
		params: {
			list: makeAtUri(did, 'app.bsky.graph.list', params.rkey),
			limit: 50,
			cursor: url.searchParams.get('cursor') || undefined,
		},
	});

	return { members: { cursor: data.cursor, items: data.items } };
};
