import type { ParamMatcher } from '@sveltejs/kit';

import { isTid } from '@atcute/lexicons/syntax';

export const match = isTid satisfies ParamMatcher;
