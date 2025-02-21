export const collectionToLabel = (collection: string): string | null => {
	switch (collection) {
		case 'app.bsky.feed.post':
			return 'post';
		case 'app.bsky.feed.generator':
			return 'feed';
		case 'app.bsky.graph.list':
			return 'list';
		case 'app.bsky.graph.starterpack':
			return 'starter pack';
		case 'app.bsky.labeler.service':
			return 'labeler';
	}

	return null;
};
