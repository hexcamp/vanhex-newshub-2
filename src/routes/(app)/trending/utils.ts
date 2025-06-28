import type { AppBskyUnspeccedDefs } from '@atcute/bluesky';
import { isDid, isHandle, isRecordKey } from '@atcute/lexicons/syntax';

// /profile/jaz.bsky.social/feed/cv:cat
// /profile/bossett.social/feed/for-science
const FEED_RE = /^\/profile\/([^/]+)\/feed\/([^/]+)$/;

// /starter-pack/crimew.gay/3lbfhvsingk2i
const STARTERPACK_RE = /^\/starter-pack\/([^/]+)\/([^/]+)$/;

export interface MappedTopic {
	type: 'feed' | 'starterpack';
	name: string;
	href: string;
}

export const mapTopic = ({ topic, link }: AppBskyUnspeccedDefs.TrendingTopic): MappedTopic | undefined => {
	let match: RegExpMatchArray | null | undefined;

	if ((match = link.match(FEED_RE))) {
		const [, actor, rkey] = match;

		if (!isHandle(actor) && !isDid(actor)) return;
		if (!isRecordKey(rkey)) return;

		return {
			type: 'feed',
			name: topic,
			href: `/${actor}/feeds/${rkey}`,
		};
	}

	if ((match = link.match(STARTERPACK_RE))) {
		const [, actor, rkey] = match;

		if (!isHandle(actor) && !isDid(actor)) return;
		if (!isRecordKey(rkey)) return;

		return {
			type: 'starterpack',
			name: topic,
			href: `/${actor}/packs/${rkey}`,
		};
	}

	return;
};
