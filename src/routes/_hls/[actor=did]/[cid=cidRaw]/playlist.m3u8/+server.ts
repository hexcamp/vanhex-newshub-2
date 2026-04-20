import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

// Bluesky serves video through two stacks with different tradeoffs:
//
//   1. `video.bsky.app/watch/{actor}/{cid}/playlist.m3u8` — the "middleware"
//      service. Always hits origin (no cache-control), injects a rotating
//      `?session_id=…` into variant URIs, and is the only source that
//      carries `#EXT-X-MEDIA TYPE=SUBTITLES` entries for caption tracks.
//      Slow, but complete.
//
//   2. `video.cdn.bsky.app/hls/{actor}/{cid}/…` — BunnyCDN serving the raw
//      playlists. Cached (`max-age=10800`), session_id-free, and fast. But
//      the stored master playlist omits caption track definitions.
//
// We proxy the middleware master playlist so we don't lose captions, then
// rewrite every variant URI to point at the CDN directly. After our one
// rewrite, the browser fetches variant playlists and `.ts` segments straight
// from BunnyCDN — our worker never sees segment traffic.
//
// Input line shapes we care about:
//
//   #EXT-X-STREAM-INF:…                  (attr line, pass through)
//   360p/video.m3u8?session_id=xxx       (variant URI, rewrite to CDN)
//   #EXT-X-MEDIA:TYPE=SUBTITLES,…,URI="subs/en.m3u8?session_id=xxx"
//                                        (caption track, strip session_id,
//                                         leave host as-is since captions
//                                         only live on the middleware)
//
// Variant URIs in the middleware master are relative to the master's URL,
// so we resolve against the upstream base before swapping hosts.

const UPSTREAM_BASE = 'https://video.bsky.app/watch';
const CDN_BASE = 'https://video.cdn.bsky.app/hls';

const URI_ATTR_RE = /URI="([^"]*)"/;

export const GET: RequestHandler = async ({ params, fetch }) => {
	const { actor, cid } = params;

	const upstreamUrl = `${UPSTREAM_BASE}/${actor}/${cid}/playlist.m3u8`;
	const upstream = await fetch(upstreamUrl);

	if (!upstream.ok) {
		error(upstream.status, `upstream playlist failed: ${upstream.statusText}`);
	}

	const source = await upstream.text();
	const rewritten = rewriteMasterPlaylist(source, upstreamUrl);

	return new Response(rewritten, {
		headers: {
			'content-type': 'application/vnd.apple.mpegurl',
			// cid-addressed content is immutable; cache for a day at the client,
			// a week at the edge
			'cache-control': 'public, max-age=86400, s-maxage=604800',
			'access-control-allow-origin': '*',
		},
	});
};

const rewriteMasterPlaylist = (source: string, upstreamUrl: string): string => {
	const lines = source.split('\n');
	const out: string[] = [];

	for (const line of lines) {
		if (line.startsWith('#EXT-X-MEDIA')) {
			out.push(line.replace(URI_ATTR_RE, (_, uri) => `URI="${cleanUpstreamUri(uri, upstreamUrl)}"`));
			continue;
		}

		if (line === '' || line.startsWith('#')) {
			out.push(line);
			continue;
		}

		out.push(rewriteVariantUri(line, upstreamUrl));
	}

	return out.join('\n');
};

const rewriteVariantUri = (uri: string, upstreamUrl: string): string => {
	const url = new URL(uri, upstreamUrl);
	url.searchParams.delete('session_id');
	return url.toString().replace(`${UPSTREAM_BASE}/`, `${CDN_BASE}/`);
};

const cleanUpstreamUri = (uri: string, upstreamUrl: string): string => {
	const url = new URL(uri, upstreamUrl);
	url.searchParams.delete('session_id');
	return url.toString();
};
