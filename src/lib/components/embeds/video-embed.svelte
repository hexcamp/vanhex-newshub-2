<script lang="ts">
	import type { AppBskyEmbedVideo } from '@atcute/client/lexicons';

	import PlaySolid from '$lib/components/central-icons/play-solid.svelte';

	interface Props {
		embed: AppBskyEmbedVideo.View;
		borderless?: boolean;
		standalone?: boolean;
		blur?: boolean;
	}

	const { embed: video, borderless, standalone, blur }: Props = $props();

	const ratio = standalone && video.aspectRatio;
</script>

{#if standalone}
	<div class={['video-embed', !borderless && 'is-bordered', standalone && 'is-standalone']}>
		<div class="constrainer" style={ratio ? `aspect-ratio: ${ratio.width}/${ratio.height}` : ``}>
			{@render Content()}
		</div>
	</div>
{:else}
	<div
		class={['video-embed', !borderless && 'is-bordered']}
		style={ratio ? `aspect-ratio: ${ratio.width}/${ratio.height}` : ``}
	>
		{@render Content()}
	</div>
{/if}

{#snippet Content()}
	<img loading="lazy" src={video.thumbnail} alt="" class={['thumbnail', blur && 'is-blurred']} />

	{#if ratio}
		<div class="placeholder"></div>
	{/if}

	<div class="play">
		<PlaySolid />
	</div>
{/snippet}

<style>
	.video-embed {
		position: relative;
		background: var(--bg-secondary);
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}
	.is-bordered {
		border: 1px solid var(--divider-md);
		border-radius: 6px;
	}
	.is-standalone {
		align-self: baseline;
		aspect-ratio: auto;
		max-width: 100%;
	}

	.constrainer {
		min-width: 64px;
		max-width: 100%;
		min-height: 64px;
		max-height: 320px;
	}

	.thumbnail {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.is-blurred {
		scale: 125%;
		filter: blur(24px);
	}

	.placeholder {
		width: 100vw;
		height: 100vh;
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

		.is-standalone &:hover {
			background: rgba(64, 64, 64, 0.8);
		}
	}
</style>
