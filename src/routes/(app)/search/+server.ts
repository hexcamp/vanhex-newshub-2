import { redirect, type RequestHandler } from '@sveltejs/kit';

import { isDid, isHandle, isRecordKey, isTid } from '@atcute/lexicons/syntax';

import {
	BSKY_FEED_LINK_RE,
	BSKY_LIST_LINK_RE,
	BSKY_POST_LINK_RE,
	BSKY_PROFILE_LINK_RE,
} from '$lib/utils/bluesky/urls';
import { asString, useSearchParams } from '$lib/utils/search-params';

import { base } from '$app/paths';

export const GET: RequestHandler = async ({ url }) => {
	const [{ q }] = useSearchParams(url, {
		q: asString.withDefault(''),
	});

	const query = q.trim();

	// redirect to user search if query starts with '@' and is a valid handle
	// if (query.startsWith('@') && isHandle(query.slice(1))) {
	// 	redirect(302, `${base}/search/users?q=${encodeURIComponent(query)}`);
	// }

	// redirect if it's a known bsky.app link
	{
		const redirectUrl = findLinkRedirect(query);
		console.log(redirectUrl, query);
		if (redirectUrl) {
			redirect(302, redirectUrl);
		}
	}

	// redirect(302, `${base}/search/posts?q=${encodeURIComponent(query)}`);

	redirect(302, `${base}/search/users?q=${encodeURIComponent(query)}`);
};

const findLinkRedirect = (raw: string): string | null | undefined => {
	const url = URL.parse(raw);
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

			return `${base}/${actor}/${rkey}`;
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

		return null;
	}

	return;
};
