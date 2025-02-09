<script lang="ts">
	import type { AppBskyFeedPost } from '@atcute/client/lexicons';

	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { createThreadData } from '$lib/models/thread';
	import { truncateMiddle, truncateRight } from '$lib/utils/strings';

	import MainPost from '$lib/components/threads/main-post.svelte';
	import OverflowThreadItem from '$lib/components/threads/overflow-thread-item.svelte';
	import PostThreadItem from '$lib/components/threads/post-thread-item.svelte';

	const { data }: PageProps = $props();

	const treeView = true;
	const thread = $derived.by(() => {
		return createThreadData({ thread: data.thread, treeView });
	});

	const title = $derived.by(() => {
		const post = thread.post;

		const author = `@${truncateMiddle(post.author.handle, 29)}`;
		const content = truncateRight((post.record as AppBskyFeedPost.Record).text.trim(), 70);

		return `${author}: "${content}" — ${PUBLIC_APP_NAME}`;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class={['thread-page', treeView ? 'is-tree' : 'is-flat']}>
	<div class="ancestors">
		{#each thread.ancestors as item (item.id)}
			{#if item.type === 'post'}
				<PostThreadItem {item} treeView={false} />
			{:else if item.type === 'blocked'}
				<div>blocked</div>
			{:else if item.type === 'overflow'}
				<OverflowThreadItem {item} treeView={false} descendant={false} />
			{/if}
		{/each}
	</div>

	<div class="thread">
		<div class="main" id="main">
			<MainPost post={thread.post} prev={thread.ancestors.length > 0} />
		</div>

		<div class="descendants">
			{#each thread.descendants as item (item.id)}
				{#if item.type === 'post'}
					<PostThreadItem {item} {treeView} />
				{:else if item.type === 'blocked'}
					<div>blocked</div>
				{:else if item.type === 'overflow'}
					<OverflowThreadItem {item} {treeView} descendant={true} />
				{/if}
			{/each}
		</div>
	</div>
</div>

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

		&:empty {
			display: none;
		}

		.is-tree & {
			padding: 4px 0;
		}
	}
</style>
