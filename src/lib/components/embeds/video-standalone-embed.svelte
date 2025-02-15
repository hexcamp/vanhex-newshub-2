<script lang="ts" module>
	const MATCH_RE = /\/(did:[a-z]+:[a-zA-Z0-9._:%-]*[a-zA-Z0-9._-])\/(bafkrei[2-7a-z]{52})\//;
</script>

<script lang="ts">
	import type { AppBskyEmbedVideo } from '@atcute/client/lexicons';

	import { dev } from '$app/environment';
	import { base } from '$app/paths';

	import { replaceVideoCdnUrl } from '$lib/utils/bsky';

	import PlaySolid from '$lib/components/central-icons/play-solid.svelte';
	import Island from '$lib/components/island.svelte';

	interface Props {
		embed: AppBskyEmbedVideo.View;
		blur?: boolean;
	}

	const { embed: video }: Props = $props();

	const ratio = $derived.by(() => {
		const aspectRatio = video.aspectRatio;
		if (!aspectRatio) {
			return undefined;
		}

		return `${aspectRatio.width}/${aspectRatio.height}`;
	});

	const videoUrl = $derived.by(() => {
		const match = MATCH_RE.exec(decodeURIComponent(video.playlist));
		if (!match) {
			return undefined;
		}

		return `${base}/watch/${match[1]}/${match[2]}`;
	});
</script>

{#snippet Content()}
	<div class={['video-standalone-embed', 'isl-video-embed', ratio && 'has-ratio']}>
		<div class="constrainer" style:aspect-ratio={ratio}>
			<a href={videoUrl} aria-label="Play video" class="link">
				<img
					loading="lazy"
					src={video.thumbnail && replaceVideoCdnUrl(video.thumbnail)}
					alt={video.alt}
					class="thumbnail"
				/>

				<div class="play">
					<PlaySolid />
				</div>
			</a>

			<!-- svelte-ignore a11y_missing_attribute -->
			<!-- <iframe src={videoUrl} allow="autoplay; fullscreen" height="320" width="180"></iframe> -->

			<div hidden={!ratio} class="hack"></div>
		</div>
	</div>
{/snippet}

<noscript class="alert">HLS video playback requires JavaScript to be enabled.</noscript>

{#if dev}
	{@render Content()}
{:else}
	<Island scriptUrl="{base}/_scripts/video-embed.js" fetchPriority="auto">
		{@render Content()}
	</Island>
{/if}

<style>
	.video-standalone-embed {
		position: relative;
		border: 1px solid var(--divider-md);
		border-radius: 6px;
		background: var(--bg-slate);
		overflow: clip;

		:global(iframe) {
			border: 0;
			width: 100%;
			height: 100%;
		}
	}
	.has-ratio {
		align-self: start;
		max-width: 100%;
	}

	.constrainer {
		aspect-ratio: 16 / 9;

		.has-ratio & {
			min-width: 64px;
			max-width: 100%;
			min-height: 64px;
			max-height: 320px;
		}
	}
	.link {
		display: block;
		border-radius: 5px;
		width: 100%;
		height: 100%;

		&:focus-visible {
			outline-offset: -2px;
		}
	}

	.thumbnail {
		width: 100%;
		height: 100%;
		object-fit: contain;
		font-size: 0;
	}

	.play {
		display: grid;
		position: absolute;
		top: 50%;
		left: 50%;
		place-items: center;
		translate: -50% -50%;
		border-radius: 50%;
		background: rgba(64, 64, 64, 0.6);
		aspect-ratio: 1 / 1;
		height: 40%;
		max-height: 48px;
		color: #ffffff;
		font-size: 20px;

		:global(.sv-icon) {
			width: 40%;
			height: 40%;
		}

		.link:hover & {
			background: rgba(64, 64, 64, 0.8);
		}
	}

	.hack {
		width: 100vw;
		height: 100vh;
	}

	.alert {
		border-radius: 6px;
		background: #fca5a5;
		padding: 8px 12px;
		color: #450a0a;
		font-weight: 500;
	}
</style>
