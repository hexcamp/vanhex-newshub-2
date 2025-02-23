import type { XRPC } from '@atcute/client';
import type {
	AppBskyActorDefs,
	AppBskyFeedDefs,
	AppBskyFeedGetTimeline,
	AppBskyFeedPost,
} from '@atcute/client/lexicons';

import {
	buildTimelineSlices,
	flattenTimelineSlices,
	type PostFilter,
	type SliceFilter,
	type TimelineItem,
	type TimelineSlice,
	type UiTimelineItem,
} from '$lib/models/timeline';
import type { AtUri } from '$lib/types/at-uri';
import type { Did } from '$lib/types/identity';
import { assertNever } from '$lib/utils/invariant';

type PostRecord = AppBskyFeedPost.Record;

export const enum TimelineType {
	PROFILE,
	CUSTOM_FEED,
	USER_LIST,
}

export const enum ProfileFilter {
	POSTS,
	POSTS_WITH_REPLIES,
	MEDIA,
}

export interface ProfileTimelineParams {
	type: TimelineType.PROFILE;
	actor: Did;
	filter: ProfileFilter;
	pinned?: boolean;
	cursor?: string;
}

export interface CustomFeedTimelineParams {
	type: TimelineType.CUSTOM_FEED;
	feed: AtUri;
	cursor?: string;
}

export interface UserListTimelineParams {
	type: TimelineType.USER_LIST;
	list: AtUri;
	cursor?: string;
}

export type TimelineParams = ProfileTimelineParams | CustomFeedTimelineParams | UserListTimelineParams;

export interface TimelinePage {
	cursor: string | undefined;
	items: UiTimelineItem[];
}

const PAGE_LIMIT = 50;

export const fetchTimeline = async ({
	rpc,
	params,
}: {
	rpc: XRPC;
	params: TimelineParams;
}): Promise<TimelinePage> => {
	let sliceFilter: SliceFilter | undefined;
	let postFilter: PostFilter | undefined;

	let timeline: AppBskyFeedGetTimeline.Output;

	switch (params.type) {
		case TimelineType.PROFILE: {
			const { data } = await rpc.get('app.bsky.feed.getAuthorFeed', {
				params: {
					actor: params.actor,
					cursor: params.cursor,
					limit: PAGE_LIMIT,
					includePins: params.pinned ?? params.filter !== ProfileFilter.MEDIA,
					filter:
						params.filter === ProfileFilter.MEDIA
							? 'posts_with_media'
							: params.filter === ProfileFilter.POSTS_WITH_REPLIES
								? 'posts_with_replies'
								: 'posts_and_author_threads',
				},
			});

			timeline = data;

			if (params.filter === ProfileFilter.POSTS) {
				sliceFilter = createProfileSliceFilter(params.actor);
			}

			break;
		}
		case TimelineType.CUSTOM_FEED: {
			const { data } = await rpc.get('app.bsky.feed.getFeed', {
				params: {
					feed: params.feed,
					cursor: params.cursor,
					limit: PAGE_LIMIT,
				},
			});

			timeline = {
				// Discover feed, wooo.
				cursor: data.cursor && data.cursor.length <= 5_000 ? data.cursor : undefined,
				feed: data.feed,
			};

			postFilter = createDuplicatePostFilter();
			break;
		}
		case TimelineType.USER_LIST: {
			const { data } = await rpc.get('app.bsky.feed.getListFeed', {
				params: {
					list: params.list,
					cursor: params.cursor,
					limit: PAGE_LIMIT,
				},
			});

			timeline = data;
			break;
		}
		default: {
			assertNever(params);
		}
	}

	const page: TimelinePage = {
		// Prevent fetching the same data over and over
		cursor: timeline.cursor !== params.cursor ? timeline.cursor : undefined,
		items: flattenTimelineSlices(buildTimelineSlices(timeline.feed, sliceFilter, postFilter)),
	};

	return page;
};

// #region Post filters
const createDuplicatePostFilter = (): PostFilter => {
	const set = new Set<string>();

	return (item) => {
		const uri = item.post.uri;

		if (set.has(uri)) {
			return false;
		}

		set.add(uri);
		return true;
	};
};

// #region Slice filters
const createProfileSliceFilter = (did: Did): SliceFilter | undefined => {
	return (slice) => {
		const items = slice.items;
		const first = items[0];

		const reply = first.reply;
		const reason = first.reason;

		// Skip any posts that doesn't seem to look like a self-thread
		if (reply && (!reason || reason.$type !== 'app.bsky.feed.defs#reasonRepost')) {
			for (const author of getReplyAuthors(reply)) {
				if (!author) {
					continue;
				}

				if (author.did !== did) {
					return yankReposts(items);
				}
			}
		}

		return true;
	};
};

// #region Utilities
/** Get the reposts out of the gutter */
const yankReposts = (items: TimelineItem[]): TimelineSlice[] | false => {
	let slices: TimelineSlice[] | false = false;
	let last: TimelineItem[] | undefined;

	for (let idx = 0, len = items.length; idx < len; idx++) {
		const item = items[idx];
		const reason = item.reason;

		if (reason && reason.$type === 'app.bsky.feed.defs#reasonRepost') {
			if (last) {
				last.push(item);
			} else {
				(slices ||= []).push({ items: (last = [item]) });
			}
		} else {
			last = undefined;
		}
	}

	return slices;
};

const getReplyAuthors = ({ root, grandparentAuthor, parent }: AppBskyFeedDefs.ReplyRef) => {
	const authors: AppBskyActorDefs.ProfileViewBasic[] = [];

	if (root.$type === 'app.bsky.feed.defs#postView') {
		authors.push(root.author);
	}

	if (grandparentAuthor) {
		authors.push(grandparentAuthor);
	}

	if (parent.$type === 'app.bsky.feed.defs#postView') {
		authors.push(parent.author);
	}

	return authors;
};
