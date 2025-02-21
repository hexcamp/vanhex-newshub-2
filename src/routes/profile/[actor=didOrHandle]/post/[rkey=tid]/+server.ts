import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

// Redirect to /:didOrHandle/:tid
export const GET: RequestHandler = async ({ params }) => {
	redirect(302, `/${params.actor}/${params.rkey}#main`);
};
