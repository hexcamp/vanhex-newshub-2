import { XRPC, simpleFetchHandler } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const { data } = await rpc.get('app.bsky.actor.getProfile', {
		params: {
			actor: params.actor,
		},
	});

	return {
		profile: data,
	};
};
