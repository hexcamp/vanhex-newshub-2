<script lang="ts">
	import type { AppBskyFeedPost } from '@atcute/bluesky';

	import { base } from '$app/paths';

	import type { UiTimelineItem } from '$lib/models/timeline';
	import { findLabel, FlagsBlurContent, FlagsBlurMedia } from '$lib/moderation';
	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';

	import ArrowsRepeatRightLeftOutlined from '$lib/components/central-icons/arrows-repeat-right-left-outlined.svelte';
	import PinOutlined from '$lib/components/central-icons/pin-outlined.svelte';
	import Embeds from '$lib/components/embeds/embeds.svelte';
	import RichtextRenderer from '$lib/components/richtext-renderer.svelte';

	import Avatar from '../avatar.svelte';
	import ContentHider from '../content-hider.svelte';
	import PostMeta from './post-meta.svelte';
	import PostMetrics from './post-metrics.svelte';

	interface Props {
		item: UiTimelineItem;
	}

	const { item }: Props = $props();

	const post = $derived(item.post);

	const author = $derived(post.author);
	const authorUrl = $derived(`${base}/${author.did}`);

	const record = $derived(post.record as AppBskyFeedPost.Main);
	const postUrl = $derived(`${base}/${author.did}/${assertCanonicalResourceUri(post.uri).rkey}#main`);

	const isAviBlurred = $derived(!!findLabel(author.labels, author.did, FlagsBlurMedia));
	const blur = $derived(findLabel(post.labels, author.did, FlagsBlurContent));
</script>

<div class={['post-feed-item', !item.next && `is-leaf`]}>
	<div class="contexts">
		{#if item.prev}
			<div class="ascendant-line-wrapper">
				<div class="line"></div>
			</div>
		{/if}

		{#if item.reason}
			{@const reason = item.reason}

			{#if reason.$type === 'app.bsky.feed.defs#reasonRepost'}
				{@const by = reason.by}
				{@const name = normalizeDisplayName(by.displayName ?? '') || by.handle.slice(0, 64)}

				<div class="context">
					<div class="aside">
						<ArrowsRepeatRightLeftOutlined />
					</div>
					<a href="/{by.did}" class="main">
						<span dir="auto" class="name">{name}</span>
						<span class="affix">{' '}reposted</span>
					</a>
				</div>
			{:else if reason.$type === 'app.bsky.feed.defs#reasonPin'}
				<div class="context">
					<div class="aside">
						<PinOutlined />
					</div>
					<span class="main">Pinned</span>
				</div>
			{/if}
		{/if}
	</div>

	<div class="content">
		<div class="aside">
			<Avatar profile={author} tabindex={-1} href={authorUrl} blur={isAviBlurred} />

			{#if item.next}
				<div class="descendant-line"></div>
			{/if}
		</div>

		<div class="main">
			<PostMeta {post} {postUrl} {authorUrl} gutterBottom />

			{#if !item.prev && record.reply}
				{@const parent = item.reply?.parent}

				<p class="reply-context">
					{#if parent?.$type === 'app.bsky.feed.defs#postView'}
						{@const author = parent.author}
						{@const name = normalizeDisplayName(author.displayName ?? '') || author.handle.slice(0, 64)}

						Replying to
						<a href="/{author.did}" dir="auto">
							{name}
						</a>
					{:else if parent?.$type === 'app.bsky.feed.defs#blockedPost'}
						Replying to a blocked post
					{:else if parent?.$type === 'app.bsky.feed.defs#notFoundPost'}
						Replying to a deleted post
					{:else}
						Replying to an unknown post
					{/if}
				</p>
			{/if}

			<ContentHider {blur}>
				<RichtextRenderer text={record.text} facets={record.facets} />

				{#if post.embed}
					<Embeds {post} embed={post.embed} />
				{/if}
			</ContentHider>

			<PostMetrics {post} />
		</div>
	</div>
</div>

<style>
	.post-feed-item {
		contain: content;
		padding: 0 16px;

		/* content-visibility: auto; */
		/* contain-intrinsic-height: 99px; */

		@media (hover: hover) {
			&:hover {
				background: var(--tap-sm);
			}
		}
	}
	.is-leaf {
		border-bottom: 1px solid var(--divider-sm);
	}

	.ascendant-line-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 36px;

		.line {
			position: absolute;
			top: 0;
			bottom: 4px;
			flex-grow: 1;
			border-left: 2px solid var(--divider-md);
		}
	}
	.descendant-line {
		flex-grow: 1;
		margin-top: 4px;
		border-left: 2px solid var(--divider-md);
	}

	.contexts {
		display: flex;
		position: relative;
		flex-direction: column;
		padding: 8px 0 4px 0;
	}
	.context {
		display: flex;
		align-items: center;
		gap: 12px;
		color: var(--text-blurb);
		font-size: 0.8125rem;
		line-height: 1.25rem;

		.aside {
			display: flex;
			flex-shrink: 0;
			justify-content: flex-end;
			width: 36px;
		}

		.main {
			display: flex;
			min-width: 0px;
			color: inherit;

			&[href]:hover {
				text-decoration-line: underline;
			}
		}

		.name {
			overflow: hidden;
			font-weight: 500;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.affix {
			flex-shrink: 0;
			white-space: pre;
		}
	}

	.content {
		display: flex;
		gap: 12px;

		.aside {
			display: flex;
			flex-shrink: 0;
			flex-direction: column;
			align-items: center;
		}

		.main {
			flex-grow: 1;
			padding-bottom: 12px;
			min-width: 0;

			& > :global(.content-hider) {
				margin: 8px 0 0 0;
			}
		}
	}

	.reply-context {
		overflow: hidden;
		color: var(--text-blurb);
		font-size: 0.8125rem;
		text-overflow: ellipsis;
		white-space: nowrap;

		a {
			color: inherit;
			font-weight: 500;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
