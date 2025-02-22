import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

// Redirect to /:didOrHandle/lists/:rkey
export const GET: RequestHandler = async ({ params }) => {
	redirect(302, `/${params.actor}/lists/${params.rkey}`);
};
