import { Client, simpleFetchHandler } from '@atcute/client';
import { isDid, type Did } from '@atcute/lexicons/syntax';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { fetchTimeline, TimelineType } from '$lib/queries/timeline';
import { makeAtUri } from '$lib/types/at-uri';

export const load: PageLoad = async ({ url, params, fetch, parent }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		const parentData = await parent();
		did = parentData.list.creator.did as Did;
	}

	const timeline = await fetchTimeline({
		client: client,
		params: {
			type: TimelineType.USER_LIST,
			list: makeAtUri(did, 'app.bsky.graph.list', params.rkey),
			cursor: url.searchParams.get('cursor') || undefined,
		},
	});

	return { timeline };
};
