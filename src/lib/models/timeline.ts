import type { AppBskyFeedDefs } from '@atcute/bluesky';
import { mapDefined } from '@mary/array-fns';

export type TimelineItem = AppBskyFeedDefs.FeedViewPost;

// #region TimelineSlice
export interface TimelineSlice {
	items: TimelineItem[];
}

// #region UiTimelineItem
const enum TimelineFlags {
	HAS_PREV = 1 << 0,
	HAS_NEXT = 1 << 1,
	IS_REPOSTED = 1 << 2,
	IS_PINNED = 1 << 3,
}

export interface UiTimelineItem extends TimelineItem {
	id: string;
	prev: boolean;
	next: boolean;
}

// #region Filters
export type SliceFilter = (slice: TimelineSlice) => boolean | TimelineSlice[];
export type PostFilter = (item: TimelineItem) => boolean;

const isNextInThread = (slice: TimelineSlice, item: TimelineItem) => {
	const items = slice.items;
	const last = items[items.length - 1];

	const parent = item.reply?.parent;

	return parent?.$type === 'app.bsky.feed.defs#postView' && last.post.cid == parent.cid;
};

const isFirstInThread = (slice: TimelineSlice, item: TimelineItem) => {
	const items = slice.items;
	const first = items[0];

	const parent = first.reply?.parent;

	return parent?.$type === 'app.bsky.feed.defs#postView' && parent.cid === item.post.cid;
};

export const buildTimelineSlices = (
	arr: TimelineItem[],
	filterSlice?: SliceFilter,
	filterPost?: PostFilter,
): TimelineSlice[] => {
	let slices: TimelineSlice[] = [];
	let jlen = 0;

	// arrange the posts into connected slices
	loop: for (let i = arr.length - 1; i >= 0; i--) {
		const item = arr[i];

		if (filterPost && !filterPost(item)) {
			continue;
		}

		for (let j = 0; j < jlen; j++) {
			const slice = slices[j];

			// skip, we already have too much.
			if (slice.items.length >= 7) {
				continue;
			}

			if (isFirstInThread(slice, item)) {
				slice.items.unshift(item);

				if (j !== 0) {
					slices.splice(j, 1);
					slices.unshift(slice);
				}

				continue loop;
			} else if (isNextInThread(slice, item)) {
				slice.items.push(item);

				if (j !== 0) {
					slices.splice(j, 1);
					slices.unshift(slice);
				}

				continue loop;
			}
		}

		slices.unshift({ items: [item] });
		jlen++;
	}

	if (filterSlice && jlen > 0) {
		const unfiltered = slices;
		slices = [];

		for (let j = 0; j < jlen; j++) {
			const slice = unfiltered[j];
			const result = filterSlice(slice);

			if (result) {
				if (Array.isArray(result)) {
					for (let k = 0, klen = result.length; k < klen; k++) {
						slices.push(result[k]);
					}
				} else {
					slices.push(slice);
				}
			}
		}
	}

	return slices;
};

export const flattenTimelineSlices = (slices: TimelineSlice[]): UiTimelineItem[] => {
	return slices.flatMap((slice) => {
		const items = slice.items;
		const len = items.length;

		return items.map((item, idx): UiTimelineItem => {
			const post = item.post;
			const reason = item.reason;

			let flags = 0;

			if (idx !== 0) {
				flags |= TimelineFlags.HAS_PREV;
			}
			if (idx !== len - 1) {
				flags |= TimelineFlags.HAS_NEXT;
			}

			switch (reason?.$type) {
				case 'app.bsky.feed.defs#reasonRepost': {
					flags |= TimelineFlags.IS_REPOSTED;
					break;
				}
				case 'app.bsky.feed.defs#reasonPin': {
					flags |= TimelineFlags.IS_PINNED;
					break;
				}
			}

			return {
				...item,
				id: `${post.author.did}-${post.cid}-${flags}`,
				prev: !!(flags & TimelineFlags.HAS_PREV),
				next: !!(flags & TimelineFlags.HAS_NEXT),
			};
		});
	});
};

export const mapTimelineItems = (arr: TimelineItem[], filterPost?: PostFilter): UiTimelineItem[] => {
	return mapDefined(arr, (item) => {
		if (filterPost && !filterPost(item)) {
			return;
		}

		const post = item.post;
		const reason = item.reason;

		let flags = 0;

		switch (reason?.$type) {
			case 'app.bsky.feed.defs#reasonRepost': {
				flags |= TimelineFlags.IS_REPOSTED;
				break;
			}
			case 'app.bsky.feed.defs#reasonPin': {
				flags |= TimelineFlags.IS_PINNED;
				break;
			}
		}

		return {
			...item,
			id: `${post.author.did}-${post.cid}-${flags}`,
			prev: false,
			next: false,
		};
	});
};
