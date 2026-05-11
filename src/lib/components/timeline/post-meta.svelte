<script lang="ts">
	import type { AppBskyFeedDefs, AppBskyFeedPost } from '@atcute/bluesky';

	import { normalizeDisplayName } from '$lib/utils/bluesky/display';

	import Time from '$lib/components/islands/time.svelte';

	interface Props {
		post: AppBskyFeedDefs.PostView;
		postUrl: string;
		authorUrl: string;
		gutterBottom?: boolean;
	}

	const { post, postUrl, authorUrl, gutterBottom = false }: Props = $props();

	const author = $derived(post.author);
	const authorName = $derived(normalizeDisplayName(author.displayName ?? ''));

	const createdAt = $derived((post.record as AppBskyFeedPost.Main).createdAt);
</script>

<div class={['post-meta', gutterBottom && 'has-bottom-gutter']}>
	<a href={authorUrl} class="name-wrapper">
		{#if authorName}
			<bdi class="display-name-wrapper">
				<span class="display-name">{authorName}</span>
			</bdi>
		{/if}

		{#if false}
			<span class="handle">@{author.handle}</span>
		{/if}
	</a>

	<span aria-hidden="true" class="dot"> · </span>

	{#if true}
		<a href={postUrl} class="date">
			<Time date={createdAt} format="relative-time" />
		</a>
	{/if}
</div>

<style>
	.post-meta {
		display: flex;
		align-items: center;
		min-width: 0;
		color: var(--text-blurb);
	}
	.has-bottom-gutter {
		margin-bottom: 2px;
	}

	.name-wrapper {
		display: flex;
		gap: 4px;
		max-width: 100%;
		overflow: hidden;
		color: inherit;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.display-name-wrapper {
		overflow: hidden;
		text-overflow: ellipsis;

		.name-wrapper:hover & {
			text-decoration: underline;
		}
	}
	.display-name {
		color: var(--text-primary);
		font-weight: 700;
	}

	.handle {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dot {
		flex-shrink: 0;
		margin: 0 6px;
	}

	.date {
		color: inherit;
		text-decoration: none;
		white-space: nowrap;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
