<script lang="ts">
	import type { AppBskyFeedDefs, AppBskyFeedThreadgate } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAddressedAtUri } from '$lib/types/at-uri';

	import { createReplyCollator } from '../utils';

	import OverflowDescendantItem from './overflow-descendant-item.svelte';
	import PostDescendantItem from './post-descendant-item.svelte';

	interface Props {
		thread: AppBskyFeedDefs.ThreadViewPost;
		threadgate?: AppBskyFeedDefs.ThreadgateView;
	}

	const { thread: root, threadgate }: Props = $props();

	const gate = $derived(threadgate?.record as AppBskyFeedThreadgate.Record | undefined);
	const sort = $derived(createReplyCollator(threadgate));
</script>

{@render Replies(root, false)}

{#snippet Replies(thread: AppBskyFeedDefs.ThreadViewPost, drawLines: boolean)}
	{@const replies = thread.replies?.toSorted((a, b) => sort(thread.post, a, b)) ?? []}

	{#each replies as item, idx}
		{#if drawLines}
			<div class="lines">
				<div hidden={idx === replies.length - 1} class="vert-line"></div>
				<div class="right-line"></div>
			</div>
		{/if}

		{#if item.$type === 'app.bsky.feed.defs#threadViewPost'}
			{@const hasDescendant = !!(item.replies?.length || item.post.replyCount)}
			{@const isNested = (item.replies?.length || item.post.replyCount || 0) > 1}

			<PostDescendantItem
				post={item.post}
				defaultCollapsed={!!gate?.hiddenReplies?.includes(item.post.uri)}
				{hasDescendant}
				{isNested}
			>
				{@render Replies(item, isNested)}
			</PostDescendantItem>
		{:else if item.$type === 'app.bsky.feed.defs#blockedPost'}
			<div>blocked</div>
		{/if}
	{:else}
		{#if thread.post.replyCount !== 0 && thread !== root}
			{@const post = thread.post}

			{#if drawLines}
				<div class="lines">
					<div class="right-line"></div>
				</div>
			{/if}

			<OverflowDescendantItem postUrl="{base}/{post.author.did}/{parseAddressedAtUri(post.uri).rkey}#main" />
		{/if}
	{/each}
{/snippet}

<style>
	.lines {
		position: relative;
	}
	.vert-line {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 25px;
		border-left: 2px solid var(--divider-md);
	}
	.right-line {
		position: absolute;
		top: 0;
		left: 25px;
		border-bottom: 2px solid var(--divider-md);
		border-left: 2px solid var(--divider-md);
		border-bottom-left-radius: 9px;
		width: 9px;
		height: 23px;
	}
</style>
