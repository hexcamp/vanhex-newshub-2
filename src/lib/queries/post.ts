import type { AppBskyFeedDefs } from '@atcute/bluesky';
import { type Client, ClientResponseError, ok } from '@atcute/client';
import type { ResourceUri } from '@atcute/lexicons';

export interface GetPostReturn {
	post: AppBskyFeedDefs.PostView;
	threadgate?: AppBskyFeedDefs.ThreadgateView;
}

export const getPost = async ({
	client,
	uri,
}: {
	client: Client;
	uri: ResourceUri;
}): Promise<GetPostReturn> => {
	const data = await ok(
		client.get('app.bsky.feed.getPostThread', {
			params: {
				uri: uri,
				depth: 0,
				parentHeight: 0,
			},
		}),
	);

	const { thread, threadgate } = data;
	switch (thread.$type) {
		case 'app.bsky.feed.defs#notFoundPost':
		case 'app.bsky.feed.defs#blockedPost': {
			throw new ClientResponseError({
				status: 400,
				data: { error: 'NotFound', message: `Post not found` },
			});
		}
	}

	return { post: thread.post, threadgate };
};
