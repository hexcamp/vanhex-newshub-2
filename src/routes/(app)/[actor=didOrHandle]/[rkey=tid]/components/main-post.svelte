<script lang="ts">
	import type { AppBskyFeedDefs, AppBskyFeedPost } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { findLabel, FlagsBlurContent, FlagsBlurMedia } from '$lib/moderation';
	import { parseAtUri } from '$lib/types/at-uri';

	import Avatar from '$lib/components/avatar.svelte';
	import SquareArrowTopRightOutlined from '$lib/components/central-icons/square-arrow-top-right-outlined.svelte';
	import ThreadOutlined from '$lib/components/central-icons/thread-outlined.svelte';
	import ContentHider from '$lib/components/content-hider.svelte';
	import Embeds from '$lib/components/embeds/embeds.svelte';
	import LongDate from '$lib/components/islands/long-date.svelte';
	import OverflowMenu from '$lib/components/overflow-menu.svelte';
	import RichTextRenderer from '$lib/components/richtext-renderer.svelte';

	import InteractionState from './interaction-state.svelte';
	import MainPostMetrics from './main-post-metrics.svelte';

	interface Props {
		post: AppBskyFeedDefs.PostView;
		prev?: boolean;
	}

	const { post, prev = false }: Props = $props();

	const uri = $derived(parseAtUri(post.uri));

	const author = $derived(post.author);
	const authorName = $derived(author.displayName?.trim());

	const record = $derived(post.record as AppBskyFeedPost.Record);

	const authorUrl = $derived(`${base}/${author.did}`);
	const postUrl = $derived(`${base}/${author.did}/${uri.rkey}#main`);

	const isAviBlurred = $derived(!!findLabel(author.labels, author.did, FlagsBlurMedia));
	const blur = $derived(findLabel(post.labels, author.did, FlagsBlurContent));
</script>

<div class="highlighted-post">
	<div class="meta">
		{#if prev}
			<div class="ancestor-line-wrapper">
				<div class="ancestor-line"></div>
			</div>
		{/if}

		<Avatar profile={author} size="lg" tabindex={-1} href={authorUrl} blur={isAviBlurred} />

		<a href={authorUrl} class="name-wrapper">
			{#if authorName}
				<bdi class="display-name-wrapper">
					<span class="display-name">{authorName}</span>
				</bdi>
			{/if}

			<span class="handle">@{author.handle}</span>
		</a>

		<OverflowMenu
			class="post-actions"
			items={[
				{
					label: `Unroll thread`,
					href: `${base}/${author.did}/${uri.rkey}/unroll`,
					icon: ThreadOutlined,
				},
				{
					label: `Open in Bluesky app`,
					href: `https://bsky.app/profile/${author.did}/post/${uri.rkey}`,
					external: true,
					icon: SquareArrowTopRightOutlined,
				},
				{
					label: `Open in PDSls`,
					href: `https://pdsls.dev/${post.uri}`,
					external: true,
					icon: SquareArrowTopRightOutlined,
				},
			]}
		/>
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
		<span aria-hidden="true" class="dot"> • </span>
		<InteractionState threadgate={post.threadgate} />
	</div>

	<MainPostMetrics {post} />
</div>

<style>
	.highlighted-post {
		padding: 12px 16px 0 16px;

		:global(.post-actions) {
			margin: 0 -4px;
		}
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
		margin: 0 auto 0 0;
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
		color: var(--text-blurb);
	}
	.date {
		color: inherit;

		&:hover {
			text-decoration: underline;
		}
	}
	.dot {
		flex-shrink: 0;
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
