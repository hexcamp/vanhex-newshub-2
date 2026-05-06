<script lang="ts">
	import type { AppBskyFeedDefs } from '@atcute/bluesky';

	import { base } from '$app/paths';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { formatLongNumber } from '$lib/utils/intl/number';

	import Avatar from '$lib/components/avatar.svelte';
	import SquareArrowTopRightOutlined from '$lib/components/central-icons/square-arrow-top-right-outlined.svelte';
	import OverflowMenu from '$lib/components/overflow-menu.svelte';
	import RichtextRawRenderer from '$lib/components/richtext-raw-renderer.svelte';
	import RichtextRenderer from '$lib/components/richtext-renderer.svelte';

	interface Props {
		feed: AppBskyFeedDefs.GeneratorView;
	}

	const { feed }: Props = $props();

	const uri = $derived(assertCanonicalResourceUri(feed.uri));

	const creatorUrl = $derived(`${base}/${feed.creator.did}`);
	const feedUrl = $derived(`${creatorUrl}/feeds/${uri.rkey}`);
</script>

<div class="feed-aside">
	<Avatar type="generator" src={feed.avatar} size="xl" />

	<OverflowMenu
		class="feed-overflow"
		items={[
			{
				label: `Open in Bluesky app`,
				href: `https://bsky.app/profile/${feed.creator.did}/feed/${uri.rkey}`,
				external: true,
				icon: SquareArrowTopRightOutlined,
			},
			{
				label: `Open in PDSls`,
				href: `https://pdsls.dev/${feed.uri}`,
				external: true,
				icon: SquareArrowTopRightOutlined,
			},
		]}
	/>

	<p dir="auto" class="display-name">{normalizeDisplayName(feed.displayName)}</p>

	{#if feed.description}
		{#if feed.descriptionFacets === undefined}
			<RichtextRawRenderer text={trimRichText(feed.description)} />
		{:else}
			<RichtextRenderer text={feed.description} facets={feed.descriptionFacets} />
		{/if}
	{/if}

	<p class="metric">
		<a href="{feedUrl}/likes" class="metric-link">
			{feed.likeCount === 1
				? `Liked by ${formatLongNumber(feed.likeCount)} user`
				: `Liked by ${formatLongNumber(feed.likeCount ?? 0)} users`}
		</a>
	</p>

	<div class="creator">
		<Avatar profile={feed.creator} size="xs" href={creatorUrl} tabindex={-1} />
		<a href={creatorUrl} class="handle">{feed.creator.handle}</a>
	</div>
</div>

<style>
	.feed-aside {
		display: flex;
		position: relative;
		flex-direction: column;
		background: var(--bg-primary);
		padding: 16px;
		min-width: 0;

		:global(.feed-overflow) {
			position: absolute;
			top: 12px;
			right: 12px;
		}
	}

	.display-name {
		margin: 16px 0 4px 0;
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.75rem;
		overflow-wrap: break-word;
	}

	.metric {
		margin: 12px 0 0 0;
		color: var(--text-blurb);
		font-size: 0.8125rem;
		line-height: 1.25rem;

		.display-name + & {
			margin: 0;
		}
	}
	.metric-link {
		color: inherit;

		&:hover {
			text-decoration: underline;
		}
	}

	.creator {
		display: flex;
		gap: 8px;
		margin: 16px 0 0 0;
		min-width: 0;
		color: var(--text-blurb);
		font-weight: 500;
	}
	.handle {
		overflow: hidden;
		color: inherit;
		text-overflow: ellipsis;
		white-space: nowrap;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
