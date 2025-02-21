<script lang="ts">
	import type { AppBskyGraphDefs } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAtUri } from '$lib/types/at-uri';
	import { purposeToLabel } from '$lib/utils/bluesky/lists';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		item: AppBskyGraphDefs.ListView;
	}

	const { item: list }: Props = $props();

	const creator = $derived(list.creator);

	const href = $derived(`${base}/${creator.did}/lists/${parseAtUri(list.uri).rkey}`);
</script>

<div class="feed-item">
	<div class="main">
		<Avatar type="list" src={list.avatar} {href} tabindex={-1} />

		<a {href} class="info">
			<p class="name">{list.name}</p>
			<p class="creator">{purposeToLabel(list.purpose)} by @{creator.handle}</p>
		</a>
	</div>

	<p class="description">{list.description?.trim()}</p>
</div>

<style>
	.feed-item {
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
