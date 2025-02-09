import type { ParamMatcher } from '@sveltejs/kit';

import { isHandle } from '$lib/types/identity';

export const match = isHandle satisfies ParamMatcher;
