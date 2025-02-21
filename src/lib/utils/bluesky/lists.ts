import type { AppBskyGraphDefs } from '@atcute/client/lexicons';

export const purposeToLabel = (purpose: AppBskyGraphDefs.ListView['purpose']): string => {
	switch (purpose) {
		case 'app.bsky.graph.defs#curatelist': {
			return `User list`;
		}
		case 'app.bsky.graph.defs#modlist': {
			return `Moderation list`;
		}
		default: {
			return `Unknown list`;
		}
	}
};
