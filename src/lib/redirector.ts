import { base } from '$app/paths';
import { ATURI_RE } from './types/at-uri';

import { isDid, isHandle } from './types/identity';
import { isRecordKey, isTid } from './types/rkey';
import {
	BSKY_FEED_LINK_RE,
	BSKY_LIST_LINK_RE,
	BSKY_POST_LINK_RE,
	BSKY_PROFILE_LINK_RE,
	BSKY_STARTERPACK_LINK_RE,
	BSKY_GO_SHORTLINK_RE,
} from './utils/bluesky/urls';
import { safeUrlParse } from './utils/url';

export const redirectBskyUrl = (rawUrl: string): string | null | undefined => {
	const url = safeUrlParse(rawUrl);
	if (!url) {
		return;
	}

	const host = url.host;
	const pathname = url.pathname;
	let match: RegExpExecArray | null | undefined;

	if (host === 'bsky.app' || host === 'staging.bsky.app' || host === 'main.bsky.dev') {
		if ((match = BSKY_PROFILE_LINK_RE.exec(pathname))) {
			const [, actor] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}

			return `${base}/${match[1]}`;
		}

		if ((match = BSKY_POST_LINK_RE.exec(pathname))) {
			const [, actor, rkey] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}
			if (!isTid(rkey)) {
				return null;
			}

			return `${base}/${actor}/${rkey}#main`;
		}

		if ((match = BSKY_FEED_LINK_RE.exec(pathname))) {
			const [, actor, rkey] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}
			if (!isRecordKey(rkey)) {
				return null;
			}

			return `${base}/${actor}/feeds/${rkey}`;
		}

		if ((match = BSKY_LIST_LINK_RE.exec(pathname))) {
			const [, actor, rkey] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}
			if (!isRecordKey(rkey)) {
				return null;
			}

			return `${base}/${actor}/lists/${rkey}`;
		}

		if ((match = BSKY_STARTERPACK_LINK_RE.exec(pathname))) {
			const [, _page, actor, rkey] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}
			if (!isRecordKey(rkey)) {
				return null;
			}

			return `${base}/${actor}/packs/${rkey}`;
		}

		return null;
	}

	if (host === 'go.bsky.app') {
		if ((match = BSKY_GO_SHORTLINK_RE.exec(pathname))) {
			const [, id] = match;

			return `${base}/go/${id}`;
		}
	}

	if (host === 'blue.mackuba.eu' && pathname === '/skythread/') {
		const author = url.searchParams.get('author') ?? '';
		const post = url.searchParams.get('post') ?? '';

		if (!isHandle(author) && !isDid(author)) {
			return null;
		}
		if (!isTid(post)) {
			return null;
		}

		return `${base}/${author}/${post}#main`;
	}

	return;
};

export const redirectAtUri = (raw: string): string | null | undefined => {
	const match = ATURI_RE.exec(raw);
	if (!match) {
		return;
	}

	const [, repo, collection, rkey] = match;

	switch (collection) {
		case 'app.bsky.actor.profile': {
			return `${base}/${repo}`;
		}
		case 'app.bsky.feed.post': {
			if (!isTid(rkey)) {
				return null;
			}

			return `${base}/${repo}/${rkey}#main`;
		}
		case 'app.bsky.feed.generator': {
			return `${base}/${repo}/feeds/${rkey}`;
		}
		case 'app.bsky.graph.list': {
			return `${base}/${repo}/lists/${rkey}`;
		}
		case 'app.bsky.graph.starterpack': {
			return `${base}/${repo}/packs/${rkey}`;
		}
	}

	return null;
};
