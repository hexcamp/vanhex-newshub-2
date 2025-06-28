import { Client, simpleFetchHandler } from '@atcute/client';
import { isDid, type Did } from '@atcute/lexicons/syntax';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { fetchTimeline, ProfileFilter, TimelineType } from '$lib/queries/timeline';

export const load: PageLoad = async ({ url, params, fetch, parent }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		const parentData = await parent();
		did = parentData.profile.did as Did;
	}

	const timeline = await fetchTimeline({
		client,
		params: {
			type: TimelineType.PROFILE,
			actor: did,
			filter: ProfileFilter.POSTS,
			cursor: url.searchParams.get('cursor') || undefined,
		},
	});

	return { timeline };
};
