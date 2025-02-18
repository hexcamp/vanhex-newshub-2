<script lang="ts">
	import type { AppBskyFeedPost } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { findLabel, FlagsBlurContent } from '$lib/moderation';
	import { parseAtUri } from '$lib/types/at-uri';

	import Avatar from '$lib/components/avatar.svelte';
	import RichtextRenderer from '$lib/components/richtext-renderer.svelte';

	import ContentHider from '$lib/components/content-hider.svelte';
	import Embeds from '$lib/components/embeds/embeds.svelte';
	import PostMeta from '$lib/components/timeline/post-meta.svelte';
	import PostMetrics from '$lib/components/timeline/post-metrics.svelte';

	import type { PostAncestorItem } from '../utils';

	interface Props {
		item: PostAncestorItem;
	}

	const { item }: Props = $props();

	const post = $derived(item.post);

	const author = $derived(post.author);
	const authorUrl = $derived(`${base}/${author.did}`);

	const record = $derived(post.record as AppBskyFeedPost.Record);
	const postUrl = $derived(`${base}/${author.did}/${parseAtUri(post.uri).rkey}#main`);

	const blur = $derived(findLabel(post.labels, author.did, FlagsBlurContent));
</script>

<div class="post-thread-item">
	<div class="content">
		<div class="aside">
			{#if item.prev}
				<div class="ascendant-line"></div>
			{/if}

			<Avatar profile={author} tabindex={-1} href={authorUrl} />

			<div class="descendant-line"></div>
		</div>

		<div class="main">
			<PostMeta {post} {postUrl} {authorUrl} gutterBottom />

			<ContentHider {blur}>
				<RichtextRenderer text={record.text} facets={record.facets} />
			</ContentHider>

			{#if post.embed}
				<Embeds {post} embed={post.embed} />
			{/if}

			<PostMetrics {post} />
		</div>
	</div>
</div>

<style>
	.post-thread-item {
		display: flex;
		contain: content;
		padding: 0 16px;

		@media (hover: hover) {
			&:hover {
				background: var(--tap-sm);
			}
		}
	}

	.content {
		display: flex;
		flex-grow: 1;
		gap: 12px;
		min-width: 0;
	}

	.ascendant-line {
		position: absolute;
		top: 0;
		border-left: 2px solid var(--divider-md);
		height: 8px;
	}
	.descendant-line {
		flex-grow: 1;
		margin: 4px 0 0 0;
		border-left: 2px solid var(--divider-md);
	}

	.aside {
		display: flex;
		position: relative;
		flex-shrink: 0;
		flex-direction: column;
		align-items: center;
		padding-top: 12px;
	}

	.main {
		flex-grow: 1;
		padding: 12px 0;
		min-width: 0;

		& > :global(.content-hider) {
			margin: 8px 0 0 0;
		}
	}
</style>
