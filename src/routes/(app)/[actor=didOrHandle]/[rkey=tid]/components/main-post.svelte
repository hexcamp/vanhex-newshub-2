<script lang="ts">
	import type { AppBskyFeedDefs, AppBskyFeedPost } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { findLabel, FlagsBlurContent } from '$lib/moderation';
	import { parseAtUri } from '$lib/types/at-uri';

	import Avatar from '$lib/components/avatar.svelte';
	import ContentHider from '$lib/components/content-hider.svelte';
	import Embeds from '$lib/components/embeds/embeds.svelte';
	import LongDate from '$lib/components/islands/long-date.svelte';
	import RichTextRenderer from '$lib/components/richtext-renderer.svelte';

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

	const blur = $derived(findLabel(post.labels, author.did, FlagsBlurContent));
</script>

<div class="highlighted-post">
	<div class="meta">
		{#if prev}
			<div class="ancestor-line-wrapper">
				<div class="ancestor-line"></div>
			</div>
		{/if}

		<Avatar profile={author} size="lg" tabindex={-1} href={authorUrl} />

		<a href={authorUrl} class="name-wrapper">
			{#if authorName}
				<bdi class="display-name-wrapper">
					<span class="display-name">{authorName}</span>
				</bdi>
			{/if}

			<span class="handle">@{author.handle}</span>
		</a>
	</div>

	<ContentHider {blur}>
		<RichTextRenderer text={record.text} facets={record.facets} large />
	</ContentHider>

	{#if post.embed}
		<Embeds {post} embed={post.embed} large />
	{/if}

	<div class="footer">
		<a href={postUrl} class="date">
			<LongDate date={record.createdAt} />
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

	.name-wrapper {
		display: block;
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
