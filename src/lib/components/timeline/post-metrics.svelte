<script lang="ts">
	import type { Component } from 'svelte';

	import type { AppBskyFeedDefs } from '@atcute/bluesky';

	import { formatCompactNumber, formatLongNumber } from '$lib/utils/intl/number';

	import ArrowsRepeatRightLeftOutlined from '$lib/components/central-icons/arrows-repeat-right-left-outlined.svelte';
	import Bubble_2Outlined from '$lib/components/central-icons/bubble-2-outlined.svelte';
	import HeartOutlined from '$lib/components/central-icons/heart-outlined.svelte';

	interface Props {
		post: AppBskyFeedDefs.PostView;
	}

	const { post }: Props = $props();

	const replyCount = $derived(post.replyCount || 0);
	const likeCount = $derived(post.likeCount || 0);
	const repostCount = $derived((post.repostCount || 0) + (post.quoteCount || 0));
</script>

{#snippet Stat(count: number, Icon: Component, one: string, many: string)}
	<div
		title={count === 1 ? `${formatLongNumber(count)} ${one}` : `${formatLongNumber(count)} ${many}`}
		class="stat"
	>
		<div class="icon">
			<Icon />
		</div>

		<span class="count">
			{formatCompactNumber(count)}
		</span>
	</div>
{/snippet}

<div class="post-metrics">
	{@render Stat(replyCount, Bubble_2Outlined, 'reply', 'replies')}
	{@render Stat(repostCount, ArrowsRepeatRightLeftOutlined, 'repost', 'reposts')}
	{@render Stat(likeCount, HeartOutlined, 'like', 'likes')}
</div>

<style>
	.post-metrics {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 12px;
		color: var(--text-blurb);
	}

	.icon {
		display: grid;
		place-items: center;
		/* font-size: 16px; */
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0px;
		max-width: 100%;
	}

	.count {
		padding-right: 8px;
		overflow: hidden;
		font-size: 0.8125rem;
		line-height: 1.25rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
