<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { AppBskyFeedDefs, AppBskyFeedPost } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAtUri } from '$lib/types/at-uri';

	import Avatar from '$lib/components/avatar.svelte';
	import Embeds from '$lib/components/embeds/embeds.svelte';
	import RichtextRenderer from '$lib/components/richtext-renderer.svelte';
	import PostMeta from '$lib/components/timeline/post-meta.svelte';
	import PostMetrics from '$lib/components/timeline/post-metrics.svelte';

	interface Props {
		post: AppBskyFeedDefs.PostView;
		defaultCollapsed?: boolean;
		children?: Snippet<[]>;
		hasDescendant?: boolean;
		isNested?: boolean;
	}

	const { post, defaultCollapsed, children, hasDescendant, isNested }: Props = $props();

	const author = $derived(post.author);
	const authorUrl = $derived(`${base}/${author.did}`);

	const record = $derived(post.record as AppBskyFeedPost.Record);
	const postUrl = $derived(`${base}/${author.did}/${parseAtUri(post.uri).rkey}`);
</script>

<details open={!defaultCollapsed} class="post-descendant-item">
	<summary class="header">
		<Avatar profile={author} size="xs" />
		<PostMeta {post} {postUrl} {authorUrl} />
	</summary>

	<div class="contents">
		<RichtextRenderer text={record.text} facets={record.facets} />

		{#if post.embed}
			<Embeds embed={post.embed} />
		{/if}

		<PostMetrics {post} />

		{#if hasDescendant}
			<div class="descendant-line"></div>
		{/if}
	</div>

	{#if hasDescendant}
		<div class={['descendant', isNested && 'has-multiple']}>
			{@render children?.()}
		</div>
	{/if}
</details>

<style>
	.post-descendant-item {
		display: flex;
		flex-direction: column;
		contain: content;
		min-width: 0;
	}

	.header {
		display: flex;
		gap: 8px;
		contain: content;
		padding: 12px;
		list-style: none;

		.post-descendant-item:not([open]) & {
			opacity: 0.5;
		}
	}

	.contents {
		display: flex;
		position: relative;
		flex-direction: column;
		margin: -10px 0 0 0;
		padding: 0 12px 12px calc(20px + 12px + 8px);
	}

	.descendant-line {
		position: absolute;
		top: 0;
		bottom: -10px;
		left: calc(12px + (20px / 2) - 1px);
		border-left: 2px solid var(--divider-md);
	}

	.has-multiple {
		display: grid;
		grid-template-columns: 20px minmax(0, 1fr);
	}
</style>
