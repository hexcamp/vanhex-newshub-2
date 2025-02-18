import { error } from '@sveltejs/kit';

import type { Records } from '@atcute/client/lexicons';

import * as v from '@badrap/valita';

import { PUBLIC_CONSTELLATION_URL } from '$env/static/public';

import type { Did } from '$lib/types/identity';
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

	const response = await fetch(requestUrl);
	if (!response.ok) {
		// @todo: replace this with a non-SvelteKit error
		error(503, `Constellation API returned ${response.status}`);
	}

	const rawJson = await response.json();
	const json = linkResponse.parse(rawJson, { mode: 'passthrough' });

	return json as LinkResponse<K>;
};
