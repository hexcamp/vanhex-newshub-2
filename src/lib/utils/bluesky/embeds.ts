import type { AppBskyEmbedRecordWithMedia, AppBskyFeedDefs } from '@atcute/client/lexicons';

export interface Embed {
	media?: AppBskyEmbedRecordWithMedia.View['media'];
	record?: AppBskyEmbedRecordWithMedia.View['record'];
}

export const unwrapMediaEmbedView = (embed: AppBskyFeedDefs.PostView['embed']): Embed['media'] => {
	switch (embed?.$type) {
		case 'app.bsky.embed.recordWithMedia#view':
			return embed.media;

		case 'app.bsky.embed.external#view':
			return embed;
		case 'app.bsky.embed.images#view':
			return embed;
		case 'app.bsky.embed.video#view':
			return embed;
	}
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
