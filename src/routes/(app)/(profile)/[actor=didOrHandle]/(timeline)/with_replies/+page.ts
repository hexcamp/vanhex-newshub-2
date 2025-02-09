import { simpleFetchHandler, XRPC } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import { fetchTimeline, ProfileFilter, TimelineType } from '$lib/queries/timeline';
import { isDid, type Did } from '$lib/types/identity';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, params, fetch, parent }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (isDid(params.actor)) {
		did = params.actor;
	} else {
		const parentData = await parent();
		did = parentData.profile.did as Did;
	}

	const timeline = await fetchTimeline({
		rpc,
		params: {
			type: TimelineType.PROFILE,
			actor: did,
			filter: ProfileFilter.POSTS_WITH_REPLIES,
			cursor: url.searchParams.get('cursor') || undefined,
		},
	});

	return { timeline };
};
