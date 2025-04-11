import { XRPC, XRPCError } from '@atcute/client';
import type { AppBskyFeedDefs, At } from '@atcute/client/lexicons';

export interface GetPostReturn {
	post: AppBskyFeedDefs.PostView;
	threadgate?: AppBskyFeedDefs.ThreadgateView;
}

export const getPost = async ({ rpc, uri }: { rpc: XRPC; uri: At.ResourceUri }): Promise<GetPostReturn> => {
	const { data } = await rpc.get('app.bsky.feed.getPostThread', {
		params: {
			uri: uri,
			depth: 0,
			parentHeight: 0,
		},
	});

	const { thread, threadgate } = data;
	switch (thread.$type) {
		case 'app.bsky.feed.defs#notFoundPost':
		case 'app.bsky.feed.defs#blockedPost': {
			throw new XRPCError(400, { kind: 'NotFound', description: 'Post not found' });
		}
	}

	return { post: thread.post, threadgate };
};
