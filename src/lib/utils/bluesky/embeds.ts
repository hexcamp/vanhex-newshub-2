import type { RecordEmbed } from '@atcute/bluesky';
import { parseCanonicalResourceUri } from '@atcute/lexicons';

export const getQuoteEmbed = (embed: RecordEmbed | undefined) => {
	switch (embed?.$type) {
		case 'app.bsky.embed.record#viewRecord': {
			return embed;
		}

		case 'app.bsky.embed.record#viewNotFound':
		case 'app.bsky.embed.record#viewDetached':
		case 'app.bsky.embed.record#viewBlocked': {
			const result = parseCanonicalResourceUri(embed.uri);
			if (!result.ok) {
				return;
			}

			const uri = result.value;
			if (uri.collection === 'app.bsky.feed.post') {
				return embed;
			}
		}
	}
};
