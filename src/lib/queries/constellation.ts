import { error } from '@sveltejs/kit';

import type { Did } from '@atcute/lexicons';
import type { Records } from '@atcute/lexicons/ambient';

import * as v from '@badrap/valita';

import { PUBLIC_APP_USER_AGENT, PUBLIC_CONSTELLATION_URL } from '$env/static/public';

import { didString, integer, nsidString, recordKeyString } from '$lib/types/valita';

const linkResponse = v.object({
	total: integer,
	cursor: v.string().nullable(),
	linking_records: v.array(
		v.object({
			did: didString,
			collection: nsidString,
			rkey: recordKeyString,
		}),
	),
});

interface LinkResponse<K extends keyof Records> {
	total: number;
	cursor: string | null;
	linking_records: Array<{
		did: Did;
		collection: K;
		rkey: string;
	}>;
}

export const getLinks = async <K extends keyof Records>({
	uri,
	collection,
	path,
	limit = 10,
	cursor = null,
}: {
	uri: string;
	collection: K;
	path: string;
	limit?: number;
	cursor?: string | null;
}): Promise<LinkResponse<K>> => {
	const requestUrl =
		`${PUBLIC_CONSTELLATION_URL}/links` +
		`?target=${encodeURIComponent(uri)}` +
		`&collection=${collection}` +
		`&path=${path}` +
		`&limit=${limit}` +
		(cursor ? `&cursor=${cursor}` : '');

	const response = await fetch(requestUrl, {
		headers: {
			'user-agent': PUBLIC_APP_USER_AGENT,
		},
	});
	if (!response.ok) {
		// @todo: replace this with a non-SvelteKit error
		error(503, `Constellation API returned ${response.status}`);
	}

	const rawJson = await response.json();
	const json = linkResponse.parse(rawJson, { mode: 'passthrough' });

	return json as LinkResponse<K>;
};

// due to the way Bluesky has designed its embeds, quotes can be in two
// different paths, `.embed.record.uri` and `.embed.record.record.uri`.
// Since Constellation can only support one path at a time, here's a function
// that will make this happen really nicely
const MP_CURSOR_RE = /^mp:(\d+)(?::(.+))?$/;

export const getLinksMultiPath = async <K extends keyof Records>({
	uri,
	collection,
	paths,
	limit = 10,
	cursor = null,
}: {
	uri: string;
	collection: K;
	paths: [string, string, ...string[]];
	limit?: number;
	cursor?: string | null;
}): Promise<LinkResponse<K>> => {
	let index = 0;
	let curs: string | null = null;

	const result: LinkResponse<K> = {
		// this will never be anything other than 0 unfortunately,
		// can't make it work across different paths
		total: 0,
		cursor: null,
		linking_records: [],
	};

	if (cursor !== null) {
		const match = MP_CURSOR_RE.exec(cursor);
		if (match === null) {
			return result;
		}

		index = parseInt(match[1], 10);
		curs = match[2] ?? null;

		if (index >= paths.length) {
			return result;
		}
	}

	while (index < paths.length) {
		const data = await getLinks({
			uri: uri,
			collection: collection,
			path: paths[index],
			limit: limit - result.linking_records.length,
			cursor: curs,
		});

		result.linking_records = [...result.linking_records, ...data.linking_records];

		// response returned a cursor, so we're breaking early
		if (data.cursor !== null) {
			result.cursor = `mp:${index}:${data.cursor}`;
			break;
		}

		// we've reached the limit
		if (result.linking_records.length >= limit) {
			break;
		}

		// move to the next path
		index++;
		curs = null;
		result.cursor = index < paths.length ? `mp:${index}` : null;
	}

	return result;
};
