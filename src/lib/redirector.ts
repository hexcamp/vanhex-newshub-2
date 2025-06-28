import { base } from '$app/paths';

import { isDid, isHandle, isRecordKey, isTid, parseResourceUri } from '@atcute/lexicons/syntax';

import {
	BSKY_FEED_LINK_RE,
	BSKY_GO_SHORTLINK_RE,
	BSKY_HASHTAG_LINK_RE,
	BSKY_LIST_LINK_RE,
	BSKY_POST_LINK_RE,
	BSKY_PROFILE_LINK_RE,
	BSKY_SEARCH_LINK_RE,
	BSKY_STARTERPACK_LINK_RE,
} from './utils/bluesky/urls';
import { safeUrlParse } from './utils/url';

export type RedirectResult =
	// Internal link pointing to ourselves
	| { type: 'internal'; url: string }
	// External link pointing to another website
	| { type: 'external'; url: string }
	// Matched but not considered valid
	| null
	// Not matched
	| undefined;

export const redirectBskyUrl = (url: URL): RedirectResult => {
	const host = url.host;
	const pathname = url.pathname;
	let match: RegExpExecArray | null | undefined;

	if (
		host === 'bsky.app' ||
		host === 'staging.bsky.app' ||
		host === 'main.bsky.dev' ||
		host === 'deer.social'
	) {
		if ((match = BSKY_PROFILE_LINK_RE.exec(pathname))) {
			const [, actor] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}

			return { type: 'internal', url: `${base}/${match[1]}` };
		}

		if ((match = BSKY_POST_LINK_RE.exec(pathname))) {
			const [, actor, rkey] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}
			if (!isTid(rkey)) {
				return null;
			}

			return { type: 'internal', url: `${base}/${actor}/${rkey}#main` };
		}

		if ((match = BSKY_FEED_LINK_RE.exec(pathname))) {
			const [, actor, rkey] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}
			if (!isRecordKey(rkey)) {
				return null;
			}

			return { type: 'internal', url: `${base}/${actor}/feeds/${rkey}` };
		}

		if ((match = BSKY_LIST_LINK_RE.exec(pathname))) {
			const [, actor, rkey] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}
			if (!isRecordKey(rkey)) {
				return null;
			}

			return { type: 'internal', url: `${base}/${actor}/lists/${rkey}` };
		}

		if ((match = BSKY_STARTERPACK_LINK_RE.exec(pathname))) {
			const [, _page, actor, rkey] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}
			if (!isRecordKey(rkey)) {
				return null;
			}

			return { type: 'internal', url: `${base}/${actor}/packs/${rkey}` };
		}

		if ((match = BSKY_SEARCH_LINK_RE.exec(pathname))) {
			const query = url.searchParams.get('q');
			if (query === null) {
				return null;
			}

			return { type: 'internal', url: `${base}/search/posts?q=${encodeURIComponent(query)}` };
		}

		if ((match = BSKY_HASHTAG_LINK_RE.exec(pathname))) {
			const [, tag] = match;

			return { type: 'internal', url: `${base}/search/posts?q=${encodeURIComponent('#' + tag)}` };
		}

		return null;
	}

	if (host === 'go.bsky.app') {
		if (pathname === '/redirect') {
			const raw = url.searchParams.get('u');
			if (raw === null) {
				return null;
			}

			const parsed = safeUrlParse(raw);
			if (parsed === null) {
				return null;
			}

			return redirectBskyUrl(parsed) || { type: 'external', url: parsed.href };
		}

		if ((match = BSKY_GO_SHORTLINK_RE.exec(pathname))) {
			const [, id] = match;

			return { type: 'internal', url: `${base}/go/${id}` };
		}
	}

	return;
};

// https://skywriter.blue/pages/georgemonbiot.bsky.social/post/3livzzfqc4c2c
const SKYWRITER_UNROLL_RE = /^\/pages\/([^/]+)\/post\/([^/]+)\/?$/;

export const redirectOtherUrl = (url: URL): RedirectResult => {
	const host = url.host;
	const pathname = url.pathname;
	let match: RegExpExecArray | null | undefined;

	if (host === 'blue.mackuba.eu' && pathname === '/skythread/') {
		const author = url.searchParams.get('author');
		const post = url.searchParams.get('post');

		if (author === null || post === null) {
			return null;
		}

		if (!isHandle(author) && !isDid(author)) {
			return null;
		}
		if (!isTid(post)) {
			return null;
		}

		return { type: 'internal', url: `${base}/${author}/${post}#main` };
	}

	if (host === 'skywriter.blue') {
		if ((match = SKYWRITER_UNROLL_RE.exec(pathname))) {
			const [, actor, rkey] = match;

			if (!isHandle(actor) && !isDid(actor)) {
				return null;
			}
			if (!isTid(rkey)) {
				return null;
			}

			return { type: 'internal', url: `${base}/${actor}/${rkey}/unroll` };
		}
	}

	// https://skyview.social/?url=https://bsky.app/profile/did:plc:tyt7lpgpfbn3c37tylht7ksy/post/3lithx22epk2l&viewtype=unroll
	if (host === 'skyview.social') {
		const uri = url.searchParams.get('url');
		if (uri === null) {
			return null;
		}

		const parsed = safeUrlParse(uri);
		if (parsed === null) {
			return null;
		}

		const redirect = redirectBskyUrl(parsed);
		if (redirect == null) {
			return null;
		}

		return redirect;
	}

	return;
};

export const redirectAtUri = (raw: string): RedirectResult => {
	const result = parseResourceUri(raw);
	if (!result.ok) {
		return;
	}

	const uri = result.value;

	if (uri.rkey) {
		switch (uri.collection) {
			case 'app.bsky.actor.profile': {
				return { type: 'internal', url: `${base}/${uri.repo}` };
			}
			case 'app.bsky.feed.post': {
				if (!isTid(uri.rkey)) {
					return null;
				}

				return { type: 'internal', url: `${base}/${uri.repo}/${uri.rkey}#main` };
			}
			case 'app.bsky.feed.generator': {
				return { type: 'internal', url: `${base}/${uri.repo}/feeds/${uri.rkey}` };
			}
			case 'app.bsky.graph.list': {
				return { type: 'internal', url: `${base}/${uri.repo}/lists/${uri.rkey}` };
			}
			case 'app.bsky.graph.starterpack': {
				return { type: 'internal', url: `${base}/${uri.repo}/packs/${uri.rkey}` };
			}
		}
	}

	if (uri.collection === undefined) {
		return { type: 'internal', url: `${base}/${uri.repo}` };
	}

	return null;
};
