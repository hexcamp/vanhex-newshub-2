<script lang="ts">
	import type { AppBskyFeedPost } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { type PostAncestorItem, type PostDescendantItem } from '$lib/models/thread';
	import { parseAtUri } from '$lib/types/at-uri';

	import Embeds from '../embeds/embeds.svelte';
	import RichtextRenderer from '../richtext-renderer.svelte';
	import PostMeta from '../timeline/post-meta.svelte';
	import PostMetrics from '../timeline/post-metrics.svelte';

	import TreeLines from './tree-lines.svelte';

	interface Props {
		item: PostAncestorItem | PostDescendantItem;
		treeView: boolean;
	}

	const { item, treeView }: Props = $props();

	const post = $derived(item.post);

	const author = $derived(post.author);
	const authorUrl = $derived(`${base}/${author.did}`);

	const record = $derived(post.record as AppBskyFeedPost.Record);
	const postUrl = $derived(`${base}/${author.did}/${parseAtUri(post.uri).rkey}#main`);
</script>

<div
	class={[
		'post-thread-item',
		treeView ? 'is-tree' : 'is-flat',
		item.prev && 'has-prev',
		item.next && 'has-next',
	]}
>
	{#if treeView}
		<TreeLines lines={item.lines} />
	{/if}

	<div class="content">
		<div class="aside">
			<div class="ascendant-line"></div>

			<a href={authorUrl} class="avatar-wrapper">
				{#if author.avatar}
					<img loading="lazy" src={author.avatar} alt="" class="avatar" />
				{/if}
			</a>

			<div class="descendant-line"></div>
		</div>

		<div class="main">
			<PostMeta {post} {postUrl} {authorUrl} gutterBottom />

			<RichtextRenderer text={record.text} facets={record.facets} />

			{#if post.embed}
				<Embeds embed={post.embed} />
			{/if}

			<PostMetrics {post} />
		</div>
	</div>
</div>

<style>
	.post-thread-item {
		display: flex;
		contain: content;

		@media (hover: hover) {
			&:hover {
				background: var(--tap-sm);
			}
		}
	}
	.is-tree {
		padding: 0 12px;
	}

	.is-flat {
		padding: 0 16px;

		&:not(.has-next) {
			border-bottom: 2px solid var(--divider-sm);
		}
	}

	.content {
		display: flex;
		flex-grow: 1;
		gap: 12px;
		min-width: 0;

		.is-tree & {
			gap: 8px;
		}
	}

	.ascendant-line {
		display: none;
		position: absolute;
		top: 0;
		border-left: 2px solid var(--divider-md);
		height: 8px;

		.is-flat.has-prev & {
			display: block;
		}
	}
	.descendant-line {
		display: none;
		flex-grow: 1;
		margin: 4px 0 0 0;
		border-left: 2px solid var(--divider-md);

		.is-tree & {
			margin: 2px 0 0 0;
		}
		.has-next & {
			display: block;
		}
	}

	.aside {
		display: flex;
		position: relative;
		flex-shrink: 0;
		flex-direction: column;
		align-items: center;
		padding-top: 12px;
	}

	.avatar-wrapper {
		display: block;
		border-radius: 9999px;
		background: var(--bg-secondary);
		width: 36px;
		height: 36px;
		overflow: hidden;

		.is-tree & {
			width: 20px;
			height: 20px;
		}

		&:hover {
			filter: brightness(0.85);
		}
	}
	.avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
		font-size: 0;
	}

	.main {
		flex-grow: 1;
		padding: 12px 0;
		min-width: 0;
	}
</style>
