<script lang="ts">
	import type { AppBskyFeedDefs } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAtUri } from '$lib/types/at-uri';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		embed: AppBskyFeedDefs.GeneratorView;
	}

	const { embed: feed }: Props = $props();

	const creator = $derived(feed.creator);
</script>

<a href="{base}/{creator.did}/feeds/{parseAtUri(feed.uri).rkey}" class="feed-embed">
	<div class="main">
		<Avatar type="generator" src={feed.avatar} />

		<div class="info">
			<p class="name">{feed.displayName}</p>
			<p class="creator">Feed by @{creator.handle}</p>
		</div>
	</div>

	<p class="description">{feed.description}</p>
</a>

<style>
	.feed-embed {
		display: flex;
		flex-direction: column;
		gap: 12px;
		border: 1px solid var(--divider-md);
		border-radius: 6px;
		padding: 12px;
		color: var(--text-primary);

		&:hover {
			background: var(--tap-sm);
		}
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
