<script lang="ts">
	import type { AppBskyFeedDefs } from '@atcute/bluesky';

	import { base } from '$app/paths';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { formatLongNumber } from '$lib/utils/intl/number';
	import { truncateMiddle } from '$lib/utils/strings';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		item: AppBskyFeedDefs.GeneratorView;
	}

	const { item: feed }: Props = $props();

	const creator = $derived(feed.creator);

	const href = $derived(`${base}/${creator.did}/feeds/${assertCanonicalResourceUri(feed.uri).rkey}`);
</script>

<div class="feed-item">
	<div class="main">
		<Avatar type="generator" src={feed.avatar} {href} tabindex={-1} />

		<a {href} class="info">
			<p class="name">{normalizeDisplayName(feed.displayName)}</p>
			<p class="creator">Feed by @{truncateMiddle(creator.handle, 29)}</p>
		</a>
	</div>

	<p class="description">{trimRichText(feed.description ?? '')}</p>

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
		min-width: 0;
		color: inherit;
		overflow-wrap: break-word;
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
