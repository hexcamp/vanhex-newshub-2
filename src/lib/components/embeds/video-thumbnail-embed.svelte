<script lang="ts">
	// This is meant to be used inside quote embeds, so it's non-standalone.

	import type { AppBskyEmbedVideo } from '@atcute/bluesky';

	import { replaceVideoCdnUrl } from '$lib/utils/bluesky/videos';

	import PlaySolid from '$lib/components/central-icons/play-solid.svelte';

	interface Props {
		embed: AppBskyEmbedVideo.View;
		borderless?: boolean;
		blur?: boolean;
	}

	const { embed: video, borderless, blur }: Props = $props();
</script>

<div class={['video-thumbnail-embed', !borderless && 'is-bordered']}>
	<div class="constrainer">
		<img
			loading="lazy"
			src={video.thumbnail && replaceVideoCdnUrl(video.thumbnail)}
			alt={video.alt}
			class={['thumbnail', blur && 'is-blurred']}
		/>

		<div class="play">
			<PlaySolid />
		</div>

		<div class="hack"></div>
	</div>
</div>

<style>
	.video-thumbnail-embed {
		position: relative;
		background: var(--bg-slate);
		overflow: hidden;
	}
	.is-bordered {
		border: 1px solid var(--divider-md);
		border-radius: 6px;
	}

	.constrainer {
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}

	.thumbnail {
		width: 100%;
		height: 100%;
		object-fit: contain;
		font-size: 0;
	}
	.is-blurred {
		scale: 125%;
		filter: blur(24px);
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
	}

	.hack {
		width: 100vw;
		height: 100vh;
	}
</style>
