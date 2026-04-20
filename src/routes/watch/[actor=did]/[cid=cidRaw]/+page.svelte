<script lang="ts">
	import type { default as HlsCtor, Fragment as HlsFragment } from 'hls.js';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let video: HTMLVideoElement | undefined = $state();
	let playing = $state(false);

	$effect(() => {
		if (!video) {
			return;
		}

		const el = video;
		// Safari, iOS, and Chromium desktop 142+ play HLS natively. Everywhere
		// else we fall back to hls.js, loaded on demand.
		const canPlayNative = el.canPlayType('application/vnd.apple.mpegurl') !== '';

		let teardown: (() => void) | undefined;

		if (canPlayNative) {
			el.src = data.playlistUrl;
			teardown = () => {
				el.removeAttribute('src');
				el.load();
			};
		} else {
			let cancelled = false;
			let destroy: (() => void) | undefined;

			import('hls.js').then(({ default: Hls }) => {
				if (cancelled || !Hls.isSupported()) {
					return;
				}
				destroy = setupHls(Hls, el, data.playlistUrl);
			});

			teardown = () => {
				cancelled = true;
				destroy?.();
			};
		}

		$effect(() => {
			if (!playing) {
				return;
			}

			const channel = new BroadcastChannel('anartia:video-player');
			const observer = new IntersectionObserver(
				(entries) => {
					const entry = entries[0];
					if (!entry.isIntersecting) {
						el.pause();
					}
				},
				{ threshold: 0.5 },
			);

			observer.observe(el);

			channel.postMessage('play');
			channel.addEventListener('message', (event) => {
				if (event.data === 'play') {
					el.pause();
				}
			});

			return () => {
				channel.close();
				observer.disconnect();
			};
		});

		return () => {
			playing = false;
			teardown?.();
		};
	});

	const setupHls = (Hls: typeof HlsCtor, video: HTMLVideoElement, playlistUrl: string) => {
		const hls = new Hls({
			capLevelToPlayerSize: true,
			startLevel: 1,
		});

		hls.loadSource(playlistUrl);
		hls.attachMedia(video);

		// drop buffered low-quality fragments once a higher level takes over, so
		// seeking back doesn't reveal the level-0 frames
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

		return () => hls.destroy();
	};
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
