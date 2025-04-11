import { error, redirect } from '@sveltejs/kit';

import * as v from '@badrap/valita';

import { PUBLIC_GO_BSKY_URL } from '$env/static/public';
import type { PageLoad } from './$types';

import { redirectBskyUrl } from '$lib/redirector';
import { safeUrlParse } from '$lib/utils/url';

const jsonSchema = v.object({
	url: v.string(),
});

export const load: PageLoad = async ({ params }) => {
	const response = await fetch(`${PUBLIC_GO_BSKY_URL}/${encodeURIComponent(params.shortid)}`, {
		headers: {
			accept: 'application/json',
		},
	});

	if (response.status === 404) {
		error(404, `Shortlink not found`);
	}
	if (!response.ok) {
		error(500, `Upstream server returned ${response.status}`);
	}

	const raw = await response.json();

	const result = jsonSchema.try(raw);
	if (!result.ok) {
		error(500, `Invalid response from upstream server`);
	}

	const url = safeUrlParse(result.value.url);
	if (!url) {
		error(500, `Invalid URL from upstream server; got ${result.value.url}`);
	}

	const redir = redirectBskyUrl(url);

	if (!redir || redir.type !== 'internal') {
		error(500, `Invalid URL from upstream server; got ${url}`);
	}

	redirect(301, redir.url);
};
