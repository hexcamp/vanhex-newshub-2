import { Client, ClientResponseError, simpleFetchHandler } from '@atcute/client';
import { error } from '@sveltejs/kit';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	const response = await client.get('app.bsky.actor.getProfile', {
		params: {
			actor: params.actor,
		},
	});

	if (!response.ok) {
		const err = response.data;
		switch (err.error) {
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

		throw new ClientResponseError(response);
	}

	return { profile: response.data };
};
