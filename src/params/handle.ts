import type { ParamMatcher } from '@sveltejs/kit';

import { isHandle } from '@atcute/lexicons/syntax';

export const match = isHandle satisfies ParamMatcher;
