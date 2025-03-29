import type { PageLoad } from './$types';

export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ params }) => {
	return {
		// Ideally we should just be using `video.cdn.bsky.app` here for the playlist,
		// the problem is that the original M3U8 playlist stored by the CDN doesn't contain
		// the caption definitions, they're added in by the middleware service.
		//
		// We'll replace the subsequent playlist and segment URLs when setting up the player.
		playlistUrl: `https://video.bsky.app/watch/${params.actor}/${params.cid}/playlist.m3u8`,
		thumbnailUrl: `https://video.cdn.bsky.app/hls/${params.actor}/${params.cid}/thumbnail.jpg`,
	};
};
