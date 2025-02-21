import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

// Redirect to /:didOrHandle
export const GET: RequestHandler = async ({ params }) => {
	redirect(302, `/${params.actor}`);
};
