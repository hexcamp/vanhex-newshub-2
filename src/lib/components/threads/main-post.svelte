<script lang="ts">
	import type { AppBskyFeedDefs, AppBskyFeedPost } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAtUri } from '$lib/types/at-uri';
	import { formatLongDate } from '$lib/utils/intl/date';

	import Embeds from '../embeds/embeds.svelte';
	import RichTextRenderer from '../richtext-renderer.svelte';

	import MainPostMetrics from './main-post-metrics.svelte';

	interface Props {
		post: AppBskyFeedDefs.PostView;
		prev?: boolean;
	}

	const { post, prev = false }: Props = $props();

	const author = $derived(post.author);
	const authorUrl = $derived(`/${author.did}`);
	const authorName = $derived(author.displayName?.trim());

	const record = $derived(post.record as AppBskyFeedPost.Record);
	const postUrl = $derived(`${base}/${author.did}/${parseAtUri(post.uri).rkey}#main`);
</script>

<div class="highlighted-post">
	<div class="meta">
		{#if prev}
			<div class="ancestor-line-wrapper">
				<div class="ancestor-line"></div>
			</div>
		{/if}

		<a href={authorUrl} class="avatar-wrapper">
			{#if author.avatar}
				<img loading="lazy" src={author.avatar} alt="" class={`avatar`} />
			{/if}
		</a>

		<a href={authorUrl} class="name-wrapper">
			{#if authorName}
				<bdi class="display-name-wrapper">
					<span class="display-name">{authorName}</span>
				</bdi>
			{/if}

			<span class="handle">@{author.handle}</span>
		</a>
	</div>

	<RichTextRenderer text={record.text} facets={record.facets} large />

	{#if post.embed}
		<Embeds embed={post.embed} large />
	{/if}

	<div class="footer">
		<a href={postUrl} class="date">
			<time datetime={record.createdAt}>
				{formatLongDate(record.createdAt)}
			</time>
		</a>
	</div>

	<MainPostMetrics {post} />
</div>

<style>
	.highlighted-post {
		padding: 12px 16px 0 16px;
	}

	.meta {
		display: flex;
		position: relative;
		align-items: center;
		gap: 12px;
		margin: 0 0 12px 0;
		color: var(--text-blurb);
	}

	.avatar-wrapper {
		display: block;
		flex-shrink: 0;
		border-radius: 9999px;
		background: var(--bg-secondary);
		width: 40px;
		height: 40px;
		overflow: hidden;

		&:hover {
			filter: brightness(0.85);
		}
	}

	.avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.is-blurred {
		scale: 125%;
		filter: blur(4px);
	}

	.name-wrapper {
		display: block;
		flex-grow: 1;
		max-width: 100%;
		overflow: hidden;
		color: inherit;
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

	.footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		margin: 12px 0 0;
		padding: 0 0 12px 0;
	}
	.date {
		color: var(--text-blurb);

		&:hover {
			text-decoration: underline;
		}
	}

	.ancestor-line-wrapper {
		display: flex;
		position: absolute;
		bottom: 100%;
		flex-direction: column;
		align-items: center;
		margin: 0 0 4px 0;
		width: 36px;
		height: 12px;
	}
	.ancestor-line {
		flex-grow: 1;
		border-left: 2px solid var(--divider-md);
	}
</style>
