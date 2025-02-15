import { fail, redirect } from '@sveltejs/kit';

import { ATURI_RE } from '$lib/types/at-uri.js';
import { isDid, isHandle } from '$lib/types/identity.js';
import { isRecordKey, isTid } from '$lib/types/rkey';
import {
	BSKY_FEED_LINK_RE,
	BSKY_LIST_LINK_RE,
	BSKY_POST_LINK_RE,
	BSKY_PROFILE_LINK_RE,
} from '$lib/utils/bsky-urls';

import { base } from '$app/paths';

export const actions = {
	async search({ request }) {
		const formData = await request.formData();

		let query = formData.get('query');
		if (typeof query !== 'string') {
			return fail(400, { place: 'search', error: `Invalid form data` });
		}

		query = query.trim();

		if (query.startsWith('@') && isHandle(query.slice(1))) {
			redirect(302, `${base}/search/users?q=${encodeURIComponent(query)}`);
		}

		redirect(302, `${base}/search/posts?q=${encodeURIComponent(query)}`);
	},
	async redirect({ request }) {
		const formData = await request.formData();

		let query = formData.get('query');
		if (typeof query !== 'string') {
			return fail(400, { place: 'redirect', error: `Invalid form data` });
		}

		query = query.trim();

		const redirectUrl = findLinkRedirect(query) || findAtUriRedirect(query);
		if (redirectUrl) {
			redirect(302, redirectUrl);
		}

		return fail(400, { place: 'redirect', error: `Invalid link provided` });
	},
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

const findAtUriRedirect = (raw: string): string | null | undefined => {
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

			return `${base}/${repo}/${rkey}`;
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
