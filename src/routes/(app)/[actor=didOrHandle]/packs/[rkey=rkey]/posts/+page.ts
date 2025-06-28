import { simpleFetchHandler, Client } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { fetchTimeline, TimelineType } from '$lib/queries/timeline';

export const load: PageLoad = async ({ url, fetch, parent }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const { pack } = await parent();

	if (!pack.list) {
		return { timeline: { cursor: undefined, items: [] } };
	}

	const timeline = await fetchTimeline({
		client: client,
		params: {
			type: TimelineType.USER_LIST,
			list: pack.list.uri,
			cursor: url.searchParams.get('cursor') || undefined,
		},
	});

	return { timeline };
};
