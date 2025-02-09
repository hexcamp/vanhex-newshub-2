import type { ParamMatcher } from '@sveltejs/kit';

import { isTid } from '$lib/types/rkey';

export const match = isTid satisfies ParamMatcher;
