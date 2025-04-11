import type { XRPC } from '@atcute/client';
import type { At } from '@atcute/client/lexicons';

import type { Did } from '$lib/types/identity';

export const resolveHandle = async ({ rpc, handle }: { rpc: XRPC; handle: At.Handle }): Promise<Did> => {
	const { data } = await rpc.get('com.atproto.identity.resolveHandle', {
		params: { handle },
	});

	// because my types are stricter than atcute's
	return data.did as Did;
};
