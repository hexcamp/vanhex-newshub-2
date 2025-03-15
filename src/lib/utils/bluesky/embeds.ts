import type { AppBskyEmbedRecordWithMedia, AppBskyFeedDefs } from '@atcute/client/lexicons';

import { parseAddressedAtUri } from '$lib/types/at-uri';

export interface Embed {
	media?: AppBskyEmbedRecordWithMedia.View['media'];
	record?: AppBskyEmbedRecordWithMedia.View['record'];
}

export type MediaEmbed = NonNullable<Embed['media']>;
export type RecordEmbed = NonNullable<Embed['record']>;

export const unwrapMediaEmbedView = (embed: AppBskyFeedDefs.PostView['embed']): Embed['media'] => {
	switch (embed?.$type) {
		case 'app.bsky.embed.recordWithMedia#view':
			return embed.media;
		case 'app.bsky.embed.record#view':
			return;
	}

	return embed;
};

export const unwrapRecordEmbedView = (embed: AppBskyFeedDefs.PostView['embed']): Embed['record'] => {
	switch (embed?.$type) {
		case 'app.bsky.embed.recordWithMedia#view':
			return embed.record;

		case 'app.bsky.embed.record#view':
			return embed;
	}
};

export const unwrapEmbedView = (embed: AppBskyFeedDefs.PostView['embed']): Embed => {
	return {
		media: unwrapMediaEmbedView(embed),
		record: unwrapRecordEmbedView(embed),
	};
};

export const getQuoteEmbedView = (embed: RecordEmbed | undefined) => {
	const record = embed?.record;

	switch (record?.$type) {
		case 'app.bsky.embed.record#viewRecord': {
			return record;
		}

		case 'app.bsky.embed.record#viewNotFound':
		case 'app.bsky.embed.record#viewDetached':
		case 'app.bsky.embed.record#viewBlocked': {
			const uri = parseAddressedAtUri(record.uri);
			if (uri.collection === 'app.bsky.feed.post') {
				return record;
			}
		}
	}
};
