import { fail, redirect, type Actions } from '@sveltejs/kit';

import { base } from '$app/paths';

import { redirectAtUri, redirectBskyUrl, redirectOtherUrl, type RedirectResult } from '$lib/redirector';
import { safeUrlParse } from '$lib/utils/url';

const MAYBE_HANDLE_RE = /^@[a-zA-Z0-9-. ]+$/;

export const actions = {
	async search({ request }) {
		const formData = await request.formData();

		let query = formData.get('query');
		if (typeof query !== 'string') {
			return fail(400, { place: 'search', error: `Invalid form data` });
		}

		query = query.trim();

		if (MAYBE_HANDLE_RE.test(query)) {
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

		let redir: RedirectResult | undefined;
		if (query.startsWith('at://')) {
			redir = redirectAtUri(query);
		} else {
			const url = safeUrlParse(query);
			if (url) {
				redir = redirectBskyUrl(url) || redirectOtherUrl(url);
			}
		}

		if (redir && redir.type === 'internal') {
			redirect(302, redir.url);
		}

		return fail(400, { place: 'redirect', error: `Invalid link provided` });
	},
} satisfies Actions;
