import {
	parseCanonicalResourceUri,
	type Did,
	type Handle,
	type Nsid,
	type ParsedCanonicalResourceUri,
	type ResourceUri,
} from '@atcute/lexicons';
import type { Records } from '@atcute/lexicons/ambient';

import { assert } from '$lib/utils/invariant';

export const makeAtUri = (
	repo: Did | Handle,
	collection: keyof Records | (Nsid & {}),
	rkey: string,
): ResourceUri => {
	return `at://${repo}/${collection as Nsid}/${rkey}`;
};

export const assertCanonicalResourceUri = (input: string): ParsedCanonicalResourceUri => {
	const result = parseCanonicalResourceUri(input);
	if (!result.ok) {
		assert(false, result.error);
	}

	return result.value;
};
