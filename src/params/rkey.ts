import type { ParamMatcher } from '@sveltejs/kit';

import { isRecordKey } from '$lib/types/rkey';

export const match = isRecordKey satisfies ParamMatcher;
