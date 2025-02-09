import type { ParamMatcher } from '@sveltejs/kit';

import { isDid } from '$lib/types/identity';

export const match = isDid satisfies ParamMatcher;
