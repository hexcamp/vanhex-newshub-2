import type { ParamMatcher } from '@sveltejs/kit';

import { isDid, isHandle, type Did, type Handle } from '$lib/types/identity';

export const match = ((param: string): param is Did | Handle => {
	return isDid(param) || isHandle(param);
}) satisfies ParamMatcher;
