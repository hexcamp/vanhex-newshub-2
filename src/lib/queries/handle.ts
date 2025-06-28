import { ok, type Client } from '@atcute/client';
import type { Did, Handle } from '@atcute/lexicons';

export const resolveHandle = async ({ client, handle }: { client: Client; handle: Handle }): Promise<Did> => {
	const data = await ok(
		client.get('com.atproto.identity.resolveHandle', {
			params: { handle },
		}),
	);

	return data.did;
};
