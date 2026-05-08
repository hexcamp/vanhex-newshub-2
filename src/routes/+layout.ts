import { Client, ok, simpleFetchHandler } from '@atcute/client';
import { isDid, type Did } from '@atcute/lexicons/syntax';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { LayoutLoad } from './$types';

import { resolveHandle } from '$lib/queries/handle';
import { makeAtUri } from '$lib/types/at-uri';
import { actor, rkey } from './config';

// https://svelte.dev/docs/kit/page-options#csr
export const csr = true;

// https://svelte.dev/docs/kit/single-page-apps
export const ssr = false;

// https://svelte.dev/docs/kit/page-options#trailingSlash
export const trailingSlash = 'always';

export const prerender = false;

export const load: LayoutLoad = async ({ params, fetch }) => {
	const client = new Client({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	// const actor = params.actor;
	// const rkey = params.rkey;
	// const actor = 'did:plc:jaa4ygmm55ban3yhsibc3n4m';
	// const rkey = 'van-bc-news';

	let did: Did;
	if (isDid(actor)) {
		did = actor;
	} else {
		did = await resolveHandle({ client: client, handle: actor });
	}

	const data = await ok(
		client.get('app.bsky.feed.getFeedGenerator', {
			params: {
				feed: makeAtUri(did, 'app.bsky.feed.generator', rkey),
			},
		}),
	);

	const view = data.view;

	return { feed: view };
};
