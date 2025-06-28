import type { ParamMatcher } from '@sveltejs/kit';

import { isDid } from '@atcute/lexicons/syntax';

export const match = isDid satisfies ParamMatcher;
