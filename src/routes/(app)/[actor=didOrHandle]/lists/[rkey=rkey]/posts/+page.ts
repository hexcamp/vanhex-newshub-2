import { simpleFetchHandler, XRPC } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { isDid, type Did } from '$lib/types/identity';
import { makeAtUri } from '$lib/types/at-uri';
import { fetchTimeline, TimelineType } from '$lib/queries/timeline';

export const load: PageLoad = async ({ url, params, fetch, parent }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		const parentData = await parent();
		did = parentData.list.creator.did as Did;
	}

	const timeline = await fetchTimeline({
		rpc,
		params: {
			type: TimelineType.USER_LIST,
			list: makeAtUri(did, 'app.bsky.graph.list', params.rkey),
			cursor: url.searchParams.get('cursor') || undefined,
		},
	});

	return { timeline };
};
