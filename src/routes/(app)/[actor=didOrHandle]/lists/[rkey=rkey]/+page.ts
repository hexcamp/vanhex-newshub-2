import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { base } from '$app/paths';

export const load: PageLoad = async ({ params, parent }) => {
	const { list } = await parent();

	const baseUrl = `${base}/${list.creator.did}/lists/${params.rkey}`;

	switch (list.purpose) {
		case 'app.bsky.graph.defs#curatelist': {
			redirect(302, `${baseUrl}/posts`);
		}
		default: {
			redirect(302, `${baseUrl}/members`);
		}
	}
};
