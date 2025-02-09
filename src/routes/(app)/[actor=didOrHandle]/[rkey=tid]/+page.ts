import { simpleFetchHandler, XRPC, XRPCError } from '@atcute/client';

import { PUBLIC_APPVIEW_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { resolveHandle } from '$lib/queries/handle';
import { makeAtUri } from '$lib/types/at-uri';
import { isDid, type Did } from '$lib/types/identity';

export const load: PageLoad = async ({ params }) => {
	const rpc = new XRPC({ handler: simpleFetchHandler({ service: PUBLIC_APPVIEW_URL }) });

	let did: Did;
	if (!isDid(params.actor)) {
		did = await resolveHandle({ rpc, handle: params.actor });
	} else {
		did = params.actor;
	}

	const uri = makeAtUri(did, 'app.bsky.feed.post', params.rkey);

	// TODO: look previous pages for an existing post
	{
	}

	const { data } = await rpc.get('app.bsky.feed.getPostThread', {
		params: {
			uri: uri,
			depth: 4,
			parentHeight: 10,
		},
	});

	const thread = data.thread;

	switch (thread.$type) {
		case 'app.bsky.feed.defs#notFoundPost': {
			throw new XRPCError(400, {
				kind: 'NotFound',
				description: `Post not found: ${uri}`,
			});
		}
		case 'app.bsky.feed.defs#blockedPost': {
			// shouldn't happen?
			throw new XRPCError(400, {
				kind: 'NotFound',
				description: `Blocked post: ${uri}`,
			});
		}
	}

	return { thread };
};
