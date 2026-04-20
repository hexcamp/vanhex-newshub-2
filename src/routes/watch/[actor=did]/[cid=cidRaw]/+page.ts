import type { PageLoad } from './$types';

import { base } from '$app/paths';

export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ params }) => {
	return {
		// served by our `/_hls/` proxy route — see +server.ts there for why
		// we can't just point at `video.cdn.bsky.app` directly
		playlistUrl: `${base}/_hls/${params.actor}/${params.cid}/playlist.m3u8`,
		thumbnailUrl: `https://video.cdn.bsky.app/hls/${params.actor}/${params.cid}/thumbnail.jpg`,
	};
};
