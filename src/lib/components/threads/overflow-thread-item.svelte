<script lang="ts">
	import type { OverflowAncestorItem, OverflowDescendantItem } from '$lib/models/thread';
	import { parseAtUri } from '$lib/types/at-uri';

	import { base } from '$app/paths';

	import DotGrid_1x3HorizontalOutlined from '$lib/components/central-icons/dot-grid-1x3-horizontal-outlined.svelte';

	import TreeLines from './tree-lines.svelte';

	interface Props {
		item: OverflowAncestorItem | OverflowDescendantItem;
		treeView: boolean;
		descendant: boolean;
	}

	const { item, treeView, descendant }: Props = $props();

	const postUrl = $derived.by(() => {
		const uri = parseAtUri(item.uri);
		return `${base}/${uri.repo}/${uri.rkey}#main`;
	});
</script>

<a
	href={postUrl}
	class={['overflow-thread-item', treeView ? 'is-tree' : 'is-flat', !descendant && 'has-next']}
>
	{#if treeView}
		<TreeLines lines={item.lines} />
	{:else}
		<div class="dots">
			<div class="dot"></div>
			<div class="dot"></div>
			<div class="dot"></div>
		</div>
	{/if}

	<div class="content">
		{#if treeView}
			<div class="circle">
				<DotGrid_1x3HorizontalOutlined />
			</div>
		{/if}

		<span class="label">
			{!descendant ? `See parent replies` : `Continue thread`}
		</span>
	</div>
</a>

<style>
	.overflow-thread-item {
		display: flex;
		user-select: none;

		@media (hover: hover) {
			&:hover {
				background: var(--tap-sm);
			}
		}
	}
	.is-tree {
		padding: 0 12px;
	}

	.is-flat {
		padding: 0 16px;

		&:not(.has-next) {
			border-bottom: 2px solid var(--divider-sm);
		}
	}

	.dots {
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 6px;
		margin: 0 12px 0 0;
		width: 36px;
	}
	.dot {
		border-left: 2px solid var(--divider-md);
		height: 2px;
	}

	.content {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 0;
	}

	.circle {
		display: grid;
		place-items: center;
		border-radius: 9999px;
		background: var(--divider-md);
		width: 20px;
		height: 20px;
		color: var(--text-blurb);
		font-size: 12px;
	}
</style>
