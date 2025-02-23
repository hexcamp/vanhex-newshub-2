<script lang="ts">
	import type { AppBskyGraphDefs, AppBskyGraphStarterpack } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAtUri } from '$lib/types/at-uri';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		item: AppBskyGraphDefs.StarterPackViewBasic | AppBskyGraphDefs.StarterPackView;
	}

	const { item: pack }: Props = $props();

	const creator = $derived(pack.creator);

	const record = $derived(pack.record as AppBskyGraphStarterpack.Record);
	const href = $derived(`${base}/${creator.did}/packs/${parseAtUri(pack.uri).rkey}`);
</script>

<div class="starterpack-item">
	<div class="main">
		<Avatar type="starterpack" {href} tabindex={-1} />

		<a {href} class="info">
			<p class="name">{record.name}</p>
			<p class="creator">Starter pack by @{creator.handle}</p>
		</a>
	</div>

	<p class="description">{record.description?.trim()}</p>
</div>

<style>
	.starterpack-item {
		display: flex;
		flex-direction: column;
		gap: 12px;
		border-bottom: 1px solid var(--divider-md);
		padding: 12px 16px;
		color: var(--text-primary);
	}

	.main {
		display: flex;
		gap: 12px;

		:global(.avatar) {
			margin: 2px;
		}
	}

	.info {
		color: inherit;
	}
	.name {
		font-weight: 700;

		.info &:hover {
			text-decoration: underline;
		}
	}

	.creator {
		color: var(--text-blurb);
		font-size: 0.8125rem;
		line-height: 1.25rem;
	}

	.description {
		display: -webkit-box;
		overflow: hidden;
		font-size: 0.8125rem;
		line-height: 1.25rem;
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
