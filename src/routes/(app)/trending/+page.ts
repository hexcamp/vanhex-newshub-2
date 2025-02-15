import { simpleFetchHandler, XRPC } from '@atcute/client';
import { mapDefined } from '@mary/array-fns';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { mapTopic } from './utils';

export const load: PageLoad = async ({ fetch }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const { data } = await rpc.get('app.bsky.unspecced.getTrendingTopics', {
		params: {
			limit: 14,
		},
	});

	return {
		suggested: mapDefined(data.suggested, mapTopic),
		topics: mapDefined(data.topics, mapTopic),
	};
};
