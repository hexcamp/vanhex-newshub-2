import type { AppBskyFeedDefs, AppBskyFeedPost, AppBskyFeedThreadgate } from '@atcute/client/lexicons';

import type { UnwrapArray } from '$lib/utils/types';

type ReplyItem = UnwrapArray<AppBskyFeedDefs.ThreadViewPost['replies']>;

export interface BlockedAncestorItem {
	type: 'blocked';
	uri: string;
}
export interface NonexistentAncestorItem {
	type: 'nonexistent';
	uri: string;
}
export interface OverflowAncestorItem {
	type: 'overflow';
	uri: string;
}
export interface PostAncestorItem {
	type: 'post';
	post: AppBskyFeedDefs.PostView;
	prev: boolean;
}

export type AncestorItem =
	| BlockedAncestorItem
	| NonexistentAncestorItem
	| OverflowAncestorItem
	| PostAncestorItem;

export const createReplyCollator = (threadgateView: AppBskyFeedDefs.ThreadgateView | undefined) => {
	const map: Record<string, number> = {};

	// https://github.com/bluesky-social/social-app/blob/e9a792e4c1e85760fd073def21aa9e921e3afa3c/src/state/queries/post-thread.ts#L276
	const getHotness = (post: AppBskyFeedDefs.PostView) => {
		const indexedAt = (map[post.indexedAt] ??= new Date(post.indexedAt).getTime());

		const hoursAgo = (Date.now() - indexedAt) / (1000 * 60 * 60);

		const likeCount = post.likeCount ?? 0;
		const likeOrder = Math.log(3 + likeCount);
		const timePenaltyExponent = 1.5 + 1.5 / (1 + Math.log(1 + likeCount));
		const timePenalty = Math.pow(hoursAgo + 2, timePenaltyExponent);

		return likeOrder / timePenalty;
	};

	const gate = threadgateView?.record as AppBskyFeedThreadgate.Record | undefined;

	return (parent: AppBskyFeedDefs.PostView, a: ReplyItem, b: ReplyItem) => {
		if (a.$type !== 'app.bsky.feed.defs#threadViewPost') {
			return 1;
		}
		if (b.$type !== 'app.bsky.feed.defs#threadViewPost') {
			return -1;
		}

		const aPost = a.post;
		const aAuthor = aPost.author;

		const bPost = b.post;
		const bAuthor = bPost.author;

		// Prioritize replies from parent's author
		{
			const aIsByOp = aAuthor.did === parent.author.did;
			const bIsByOp = bAuthor.did === parent.author.did;

			if (aIsByOp && bIsByOp) {
				// Prioritize oldest first for own reply
				if (aPost.indexedAt > bPost.indexedAt) {
					return 1;
				}
				if (aPost.indexedAt < bPost.indexedAt) {
					return -1;
				}

				return 0;
			} else if (aIsByOp) {
				return -1;
			} else if (bIsByOp) {
				return 1;
			}
		}

		// Deprioritize hidden replies
		{
			const aIsHidden = gate?.hiddenReplies?.includes(aPost.uri);
			const bIsHidden = gate?.hiddenReplies?.includes(bPost.uri);

			if (aIsHidden && bIsHidden) {
				return 0;
			} else if (aIsHidden) {
				return 1;
			} else if (bIsHidden) {
				return -1;
			}
		}

		return getHotness(bPost) - getHotness(aPost);
	};
};

export const getAncestors = (thread: AppBskyFeedDefs.ThreadViewPost) => {
	const ancestors: AncestorItem[] = [];
	let parent = thread.parent;

	while (parent) {
		const type = parent.$type;
		if (type === 'app.bsky.feed.defs#blockedPost') {
			const uri = parent.uri;

			ancestors.push({ type: 'blocked', uri });
		} else if (type === 'app.bsky.feed.defs#notFoundPost') {
			const uri = parent.uri;

			ancestors.push({ type: 'nonexistent', uri });
		} else if (type === 'app.bsky.feed.defs#threadViewPost') {
			const post = parent.post;

			ancestors.push({ type: 'post', post, prev: true });
			parent = parent.parent;

			continue;
		}

		break;
	}

	{
		const last = ancestors[ancestors.length - 1];

		if (last && last.type === 'post') {
			const post = last.post;
			const reply = (post.record as AppBskyFeedPost.Record).reply;

			if (reply) {
				const uri = reply.parent.uri;

				ancestors.push({ type: 'overflow', uri: uri });
			} else {
				last.prev = false;
			}
		}
	}

	return ancestors.reverse();
};
