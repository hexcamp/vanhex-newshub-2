<script lang="ts">
	import type { AppBskyFeedDefs } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAtUri } from '$lib/types/at-uri';

	import Avatar from '$lib/components/avatar.svelte';
	import { formatLongNumber } from '$lib/utils/intl/number';

	interface Props {
		item: AppBskyFeedDefs.GeneratorView;
	}

	const { item: feed }: Props = $props();

	const creator = $derived(feed.creator);

	const href = $derived(`${base}/${creator.did}/feeds/${parseAtUri(feed.uri).rkey}`);
</script>

<div class="feed-item">
	<div class="main">
		<Avatar type="generator" src={feed.avatar} {href} />

		<a {href} class="info">
			<p class="name">{feed.displayName}</p>
			<p class="creator">Feed by @{creator.handle}</p>
		</a>
	</div>

	<p class="description">{feed.description?.trim()}</p>

	<p class="metric">
		{feed.likeCount === 1
			? `Liked by ${formatLongNumber(feed.likeCount)} user`
			: `Liked by ${formatLongNumber(feed.likeCount ?? 0)} users`}
	</p>
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

	.metric {
		color: var(--text-blurb);
		font-size: 0.8125rem;
		line-height: 1.25rem;
	}
</style>
