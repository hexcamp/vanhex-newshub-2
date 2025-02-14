import { XRPC, XRPCError, simpleFetchHandler } from '@atcute/client';
import { error } from '@sveltejs/kit';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	try {
		const { data } = await rpc.get('app.bsky.actor.getProfile', {
			params: {
				actor: params.actor,
			},
		});

		return {
			profile: data,
		};
	} catch (err) {
		if (err instanceof XRPCError) {
			switch (err.kind) {
				case 'InvalidRequest': {
					error(404, `Account doesn't exist`);
				}
				case 'AccountTakedown': {
					error(404, `Account is taken down`);
				}
				case 'AccountDeactivated': {
					error(404, `Account is deactivated`);
				}
			}
		}

		throw err;
	}
};
