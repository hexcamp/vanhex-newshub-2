<script lang="ts">
	import type { AppBskyFeedDefs, AppBskyFeedPost, AppBskyFeedThreadgate } from '@atcute/client/lexicons';

	import { base } from '$app/paths';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { parseAtUri } from '$lib/types/at-uri';
	import { truncateMiddle, truncateRight } from '$lib/utils/strings';

	import MainPost from './components/main-post.svelte';
	import MissingDescendantItem from './components/missing-descendant-item.svelte';
	import OverflowAscendantItem from './components/overflow-ascendant-item.svelte';
	import OverflowDescendantItem from './components/overflow-descendant-item.svelte';
	import PostAscendantItem from './components/post-ascendant-item.svelte';
	import PostDescendantItem from './components/post-descendant-item.svelte';

	import { createReplyCollator, getAncestors } from './utils';

	const { data }: PageProps = $props();

	const title = $derived.by(() => {
		const post = data.thread.post;

		const author = `@${truncateMiddle(post.author.handle, 29)}`;
		const content = truncateRight((post.record as AppBskyFeedPost.Record).text.trim(), 70);

		return `${author}: "${content}" — ${PUBLIC_APP_NAME}`;
	});

	const gate = $derived(data.threadgate?.record as AppBskyFeedThreadgate.Record | undefined);
	const sort = $derived(createReplyCollator(data.threadgate));

	const ancestors = $derived(getAncestors(data.thread));

	const missingReplyCount = $derived.by(() => {
		return (data.thread.post.replyCount ?? 0) - (data.thread.replies?.length ?? 0);
	});
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="canonical" href="{base}/{data.thread.post.author.did}/{parseAtUri(data.thread.post.uri).rkey}" />
</svelte:head>

<div class="thread-page">
	<div class="ancestors">
		{#each ancestors as item}
			{#if item.type === 'post'}
				<PostAscendantItem {item} />
			{:else if item.type === 'blocked'}
				<div>blocked</div>
			{:else if item.type === 'overflow'}
				{@const uri = parseAtUri(item.uri)}

				<OverflowAscendantItem postUrl="{base}/{uri.repo}/{uri.rkey}#main" />
			{/if}
		{/each}
	</div>

	<div class="thread">
		<div class="main" id="main">
			<MainPost post={data.thread.post} prev={ancestors.length > 0} />
		</div>

		<div class="descendants">
			<!-- thanks Svelte for your whitespace handling -->
			<!-- prettier-ignore -->
			{@render Replies(data.thread, false)}{#if missingReplyCount > 0}
				<MissingDescendantItem count={missingReplyCount} />
			{/if}
		</div>
	</div>
</div>

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
		{#if thread.post.replyCount !== 0 && thread !== data.thread}
			{@const post = thread.post}

			{#if drawLines}
				<div class="lines">
					<div class="right-line"></div>
				</div>
			{/if}

			<OverflowDescendantItem postUrl="{base}/{post.author.did}/{parseAtUri(post.uri).rkey}#main" />
		{/if}
	{/each}
{/snippet}

<style>
	.thread-page {
		display: flex;
		flex-direction: column;
		margin: 24px auto;
		width: 100%;
		max-width: 600px;
	}

	.thread {
		min-height: calc(100dvh - (24px * 2));
	}

	.main,
	.ancestors,
	.descendants {
		background: var(--bg-primary);
	}

	.main {
		scroll-margin: 24px;
	}

	.ancestors {
		&:empty {
			display: none;
		}
	}

	.descendants {
		border-top: 1px solid var(--divider-md);
		padding: 4px 0;

		&:empty {
			display: none;
		}
	}

	.lines {
		position: relative;
	}
	.vert-line {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 21px;
		border-left: 2px solid var(--divider-md);
	}
	.right-line {
		position: absolute;
		top: 0;
		left: 21px;
		border-bottom: 2px solid var(--divider-md);
		border-left: 2px solid var(--divider-md);
		border-bottom-left-radius: 9px;
		width: 9px;
		height: 23px;
	}
</style>
