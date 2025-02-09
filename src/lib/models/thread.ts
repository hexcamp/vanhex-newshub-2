import type { Brand, AppBskyFeedDefs, AppBskyFeedPost } from '@atcute/client/lexicons';

export const enum LineType {
	// <empty>
	NONE,
	// │
	VERTICAL,
	// ├
	VERTICAL_RIGHT,
	// └
	UP_RIGHT,
}

interface BaseAncestor {
	id: string;
	lines?: undefined;
}

export interface BlockedAncestorItem extends BaseAncestor {
	type: 'blocked';
	uri: string;
}
export interface NonexistentAncestorItem extends BaseAncestor {
	type: 'nonexistent';
	uri: string;
}
export interface OverflowAncestorItem extends BaseAncestor {
	type: 'overflow';
	uri: string;
}
export interface PostAncestorItem extends BaseAncestor {
	type: 'post';
	post: AppBskyFeedDefs.PostView;
	prev: boolean;
	next: boolean;
}

export type AncestorItem =
	| BlockedAncestorItem
	| NonexistentAncestorItem
	| OverflowAncestorItem
	| PostAncestorItem;

interface BaseDescendant {
	id: string;
	lines: LineType[];
}

export interface BlockedDescendantItem extends BaseDescendant {
	type: 'blocked';
	uri: string;
}
export interface OverflowDescendantItem extends BaseDescendant {
	type: 'overflow';
	uri: string;
}
export interface PostDescendantItem extends BaseDescendant {
	type: 'post';
	post: AppBskyFeedDefs.PostView;
	prev: boolean;
	next: boolean;
}

export type DescendantItem = BlockedDescendantItem | OverflowDescendantItem | PostDescendantItem;

export interface ThreadData {
	post: AppBskyFeedDefs.PostView;
	ancestors: AncestorItem[];
	descendants: DescendantItem[];
}

export const createThreadData = ({
	thread,
	treeView,
}: {
	thread: Brand.Union<AppBskyFeedDefs.ThreadViewPost>;
	treeView?: boolean;
}): ThreadData => {
	let ancestors: AncestorItem[];
	let descendants: DescendantItem[];

	{
		let parent = thread.parent;

		ancestors = [];

		while (parent) {
			const type = parent.$type;
			if (type === 'app.bsky.feed.defs#blockedPost') {
				const uri = parent.uri;

				ancestors.push({ id: uri, type: 'blocked', uri: uri });
			} else if (type === 'app.bsky.feed.defs#notFoundPost') {
				const uri = parent.uri;

				ancestors.push({ id: uri, type: 'nonexistent', uri: uri });
			} else if (type === 'app.bsky.feed.defs#threadViewPost') {
				const post = parent.post;

				ancestors.push({ id: post.uri, type: 'post', post: post, prev: true, next: true });
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

					ancestors.push({ id: uri, type: 'overflow', uri: uri });
				} else {
					last.prev = false;
				}
			}
		}

		ancestors.reverse();
	}

	{
		const traverse = (
			parent: AppBskyFeedDefs.PostView,
			replies: AppBskyFeedDefs.ThreadViewPost['replies'] | undefined,
			depth: number,
			lines: LineType[],
		): DescendantItem[] => {
			if (!replies || replies.length === 0) {
				if (depth !== 0 && parent.replyCount) {
					return [
						{
							id: 'overflow-' + parent.uri,
							type: 'overflow',
							uri: parent.uri,
							lines: treeView ? lines.concat(LineType.UP_RIGHT) : lines,
						},
					];
				}

				return [];
			}

			// Filter the replies to only what we want
			const items = replies.filter(
				(x): x is Brand.Union<AppBskyFeedDefs.ThreadViewPost | AppBskyFeedDefs.BlockedPost> => {
					const type = x.$type;

					return type === 'app.bsky.feed.defs#threadViewPost' || type === 'app.bsky.feed.defs#blockedPost';
				},
			);

			// Sort the replies
			const did = parent.author.did;
			items.sort((a, b) => {
				if (a.$type !== 'app.bsky.feed.defs#threadViewPost') {
					return 1;
				}
				if (b.$type !== 'app.bsky.feed.defs#threadViewPost') {
					return -1;
				}

				const aPost = a.post;
				const aAuthor = aPost.author;
				const aIndexed = new Date(aPost.indexedAt).getTime();

				const bPost = b.post;
				const bAuthor = bPost.author;
				const bIndexed = new Date(aPost.indexedAt).getTime();

				// Prioritize replies from parent's author
				{
					const aIsByOp = aAuthor.did === did;
					const bIsByOp = bAuthor.did === did;

					if (aIsByOp && bIsByOp) {
						// Prioritize oldest first for own reply
						return aIndexed - bIndexed;
					} else if (aIsByOp) {
						return -1;
					} else if (bIsByOp) {
						return 1;
					}
				}

				return getHotness(bPost, bIndexed) - getHotness(aPost, aIndexed);
			});

			// Iterate through the replies
			const array: DescendantItem[] = [];
			for (let idx = 0, len = items.length; idx < len; idx++) {
				const reply = items[idx];
				const type = reply.$type;

				const end = idx === len - 1;
				const nlines =
					treeView && depth !== 0 ? lines.concat(end ? LineType.UP_RIGHT : LineType.VERTICAL_RIGHT) : lines;

				if (type === 'app.bsky.feed.defs#threadViewPost') {
					const post = reply.post;
					const children = traverse(
						post,
						reply.replies,
						depth + 1,
						treeView && depth !== 0 ? lines.concat(end ? LineType.NONE : LineType.VERTICAL) : lines,
					);

					array.push({
						id: post.uri,
						type: 'post',
						post: post,
						prev: depth !== 0,
						next: children.length !== 0,
						lines: nlines,
					});

					push(array, children);
				} else if (type === 'app.bsky.feed.defs#blockedPost') {
					array.push({
						id: reply.uri,
						type: 'blocked',
						uri: reply.uri,
						lines: nlines,
					});
				}

				if (!treeView && depth !== 0) {
					break;
				}
			}

			return array;
		};

		descendants = traverse(thread.post, thread.replies, 0, []);
	}

	return {
		post: thread.post,
		ancestors: ancestors,
		descendants: descendants,
	};
};

const push = <T>(target: T[], source: T[]) => {
	for (let idx = 0, len = source.length; idx < len; idx++) {
		const item = source[idx];
		target.push(item);
	}
};

// https://github.com/bluesky-social/social-app/blob/e9a792e4c1e85760fd073def21aa9e921e3afa3c/src/state/queries/post-thread.ts#L276
const getHotness = (post: AppBskyFeedDefs.PostView, indexedAt: number) => {
	const hoursAgo = (Date.now() - indexedAt) / (1000 * 60 * 60);

	const likeCount = post.likeCount ?? 0;
	const likeOrder = Math.log(3 + likeCount);
	const timePenaltyExponent = 1.5 + 1.5 / (1 + Math.log(1 + likeCount));
	const timePenalty = Math.pow(hoursAgo + 2, timePenaltyExponent);

	return likeOrder / timePenalty;
};
