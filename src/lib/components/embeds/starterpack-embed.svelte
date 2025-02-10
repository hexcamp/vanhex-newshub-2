<script lang="ts">
	import type { AppBskyGraphDefs, AppBskyGraphStarterpack } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAtUri } from '$lib/types/at-uri';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		embed: AppBskyGraphDefs.StarterPackViewBasic;
		large?: boolean;
	}

	const { embed: pack, large = false }: Props = $props();

	const record = pack.record as AppBskyGraphStarterpack.Record;

	const creator = $derived(pack.creator);

	const rkey = $derived(parseAtUri(pack.uri).rkey);
</script>

<a href="{base}/{creator.did}/packs/{rkey}" class="starterpack-embed">
	{#if large}
		<img loading="lazy" src="https://ogcard.cdn.bsky.app/start/{creator.did}/{rkey}" alt="" class="banner" />
	{/if}

	<div class="meta">
		<div class="main">
			<Avatar type="starterpack" />

			<div class="info">
				<p class="name">{record.name}</p>
				<p class="creator">Starter pack by @{creator.handle}</p>
			</div>
		</div>

		<p class="description">{record.description}</p>
	</div>
</a>

<style>
	.starterpack-embed {
		display: block;
		border: 1px solid var(--divider-md);
		border-radius: 6px;
		overflow: hidden;
		color: var(--text-primary);

		&:hover {
			background: var(--tap-sm);
		}
	}

	.banner {
		display: block;
		aspect-ratio: 1.91;
		width: 100%;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 12px;
	}

	.main {
		display: flex;
		gap: 12px;

		:global(.avatar) {
			margin: 2px;
		}
	}

	.name {
		font-weight: 700;
	}

	.creator {
		color: var(--text-blurb);
		font-size: 0.8125rem;
	}

	.description {
		display: -webkit-box;
		overflow: hidden;
		font-size: 0.8125rem;
		white-space: pre-wrap;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow-wrap: break-word;

		&:empty {
			display: none;
		}
	}
</style>
