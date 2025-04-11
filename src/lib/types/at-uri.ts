import type { At, Records } from '@atcute/client/lexicons';

import { assert } from '$lib/utils/invariant';

import { isDid, isHandle, type Did, type Handle } from './identity';
import { isNsid, type Nsid } from './nsid';
import { isRecordKey, type RecordKey } from './rkey';

const ATURI_RE =
	/^at:\/\/([a-zA-Z0-9._:%-]+)(?:\/([a-zA-Z0-9-.]+)(?:\/([a-zA-Z0-9._~:@!$&%')(*+,;=-]+))?)?(?:#(\/[a-zA-Z0-9._~:@!$&%')(*+,;=\-[\]/\\]*))?$/;

export type AddressedAtUri = {
	repo: Did;
	collection: Nsid;
	rkey: RecordKey;
	fragment: string | undefined;
};

export const parseAddressedAtUri = (str: string): AddressedAtUri => {
	const match = ATURI_RE.exec(str);
	assert(match !== null, `invalid addressed-at-uri: ${str}`);

	const [, r, c, k, f] = match;
	assert(isDid(r), `invalid repo in addressed-at-uri: ${r}`);
	assert(isNsid(c), `invalid collection in addressed-at-uri: ${c}`);
	assert(isRecordKey(k), `invalid rkey in addressed-at-uri: ${k}`);

	return {
		repo: r,
		collection: c,
		rkey: k,
		fragment: f,
	};
};

export type PartialAtUri =
	| { repo: Did | Handle; collection: undefined; rkey: undefined; fragment: string | undefined }
	| { repo: Did | Handle; collection: Nsid; rkey: undefined; fragment: string | undefined }
	| { repo: Did | Handle; collection: Nsid; rkey: RecordKey; fragment: string | undefined };

export const parsePartialAtUri = (str: string): PartialAtUri => {
	const match = ATURI_RE.exec(str);
	assert(match !== null, `invalid partial-at-uri: ${str}`);

	const [, r, c, k, f] = match;
	assert(isDid(r) || isHandle(r), `invalid repo in partial-at-uri: ${r}`);
	assert(c === undefined || isNsid(c), `invalid collection in partial-at-uri: ${c}`);
	assert(k === undefined || isRecordKey(k), `invalid rkey in partial-at-uri: ${k}`);

	return {
		repo: r,
		collection: c,
		rkey: k,
		fragment: f,
	};
};

export const makeAtUri = (
	repo: Did | Handle,
	collection: keyof Records | (Nsid & {}),
	rkey: string,
): At.ResourceUri => {
	return `at://${repo}/${collection as Nsid}/${rkey}`;
};
