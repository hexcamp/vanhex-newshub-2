import { Client, simpleFetchHandler } from '@atcute/client';
import { isDid, type Did } from '@atcute/lexicons/syntax';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { fetchTimeline, TimelineType } from '$lib/queries/timeline';
import { makeAtUri } from '$lib/types/at-uri';
import { actor, rkey } from './config';

export const load: PageLoad = async ({ url, params, fetch, parent }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	// const actor = params.actor;
	// const rkey = params.rkey;
	// const actor = 'did:plc:jaa4ygmm55ban3yhsibc3n4m';
	// const rkey = 'van-bc-news';

	let did: Did;
	if (isDid(actor)) {
		did = actor;
	} else {
		const parentData = await parent();
		did = parentData.feed.creator.did as Did;
	}

	const timeline = await fetchTimeline({
		client: client,
		params: {
			type: TimelineType.CUSTOM_FEED,
			feed: makeAtUri(did, 'app.bsky.feed.generator', rkey),
			cursor: url.searchParams.get('cursor') || undefined,
		},
	});

	return { timeline };
};
