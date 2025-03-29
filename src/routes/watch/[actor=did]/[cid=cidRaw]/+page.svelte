<script lang="ts">
	import Hls, { type Fragment as HlsFragment } from 'hls.js';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let video: HTMLVideoElement | undefined = $state();
	let playing = $state(false);

	$effect(() => {
		if (!video) {
			return;
		}

		const hls = new Hls({
			capLevelToPlayerSize: true,
			startLevel: 1,
			xhrSetup(xhr, urlString) {
				if (!urlString.endsWith('/playlist.m3u8')) {
					urlString = urlString.replace('https://video.bsky.app/watch/', 'https://video.cdn.bsky.app/hls/');
				}

				const url = new URL(urlString);

				// Remove `session_id` everywhere
				url.searchParams.delete('session_id');

				xhr.open('get', url.toString());
			},
		});

		hls.loadSource(data.playlistUrl);
		hls.attachMedia(video);

		$effect(() => {
			if (!playing) {
				return;
			}

			const channel = new BroadcastChannel('anartia:video-player');
			const observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (!entry.isIntersecting) {
						video!.pause();
					}
				},
				{ threshold: 0.5 },
			);

			observer.observe(video!);

			channel.postMessage('play');
			channel.addEventListener('message', (event) => {
				if (event.data === 'play') {
					video!.pause();
				}
			});

			return () => {
				channel.close();
				observer.disconnect();
			};
		});

		// Low-quality fragment flushing
		{
			let lowQualityFragments: HlsFragment[] = [];

			hls.on(Hls.Events.FRAG_BUFFERED, (_event, { frag }) => {
				if (frag.level === 0) {
					lowQualityFragments.push(frag);
				}
			});

			hls.on(Hls.Events.FRAG_CHANGED, (_event, { frag }) => {
				if (hls.nextAutoLevel > 0) {
					const flushed: HlsFragment[] = [];

					for (const lowQualFrag of lowQualityFragments) {
						if (Math.abs(frag.start - lowQualFrag.start) < 0.1) {
							continue;
						}

						hls.trigger(Hls.Events.BUFFER_FLUSHING, {
							startOffset: lowQualFrag.start,
							endOffset: lowQualFrag.end,
							type: 'video',
						});

						flushed.push(lowQualFrag);
					}

					lowQualityFragments = lowQualityFragments.filter((f) => !flushed.includes(f));
				}
			});

			video.addEventListener('ended', () => {
				if (hls.nextAutoLevel > 0 && lowQualityFragments.length === 1 && lowQualityFragments[0].start === 0) {
					const lowQualFrag = lowQualityFragments[0];

					hls.trigger(Hls.Events.BUFFER_FLUSHING, {
						startOffset: lowQualFrag.start,
						endOffset: lowQualFrag.end,
						type: 'video',
					});

					lowQualityFragments = [];
				}
			});
		}

		return () => {
			playing = false;
			hls.destroy();
		};
	});
</script>

{#key data.playlistUrl}
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={video}
		poster={data.thumbnailUrl}
		controls
		playsinline
		autoplay
		onplay={() => {
			playing = true;
		}}
		onpause={() => {
			playing = false;
		}}
		onloadedmetadata={() => {
			const hasAudio =
				// @ts-expect-error: Mozilla-specific
				video.mozHasAudio ||
				// @ts-expect-error: WebKit/Blink-specific
				!!video.webkitAudioDecodedByteCount ||
				// @ts-expect-error: WebKit-specific
				!!(video.audioTracks && video.audioTracks.length);

			video!.loop = !hasAudio || video!.duration <= 6;
		}}
	>
	</video>
{/key}

<style>
	:global(body) {
		margin: 0;
		width: 100dvw;
		height: 100dvh;
		overflow: hidden;
	}

	video {
		background: #000000;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
</style>
