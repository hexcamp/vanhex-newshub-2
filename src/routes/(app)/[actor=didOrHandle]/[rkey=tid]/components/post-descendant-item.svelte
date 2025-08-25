<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { AppBskyFeedDefs, AppBskyFeedPost } from '@atcute/bluesky';

	import { base } from '$app/paths';

	import { findLabel, FlagsBlurContent, FlagsBlurMedia } from '$lib/moderation';
	import { assertCanonicalResourceUri } from '$lib/types/at-uri';

	import Avatar from '$lib/components/avatar.svelte';
	import ContentHider from '$lib/components/content-hider.svelte';
	import Embeds from '$lib/components/embeds/embeds.svelte';
	import RichtextRenderer from '$lib/components/richtext-renderer.svelte';
	import PostMeta from '$lib/components/timeline/post-meta.svelte';
	import PostMetrics from '$lib/components/timeline/post-metrics.svelte';

	import CircleMinusOutlined from '$lib/components/central-icons/circle-minus-outlined.svelte';
	import CirclePlusOutlined from '$lib/components/central-icons/circle-plus-outlined.svelte';

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

	const record = $derived(post.record as AppBskyFeedPost.Main);
	const postUrl = $derived(`${base}/${author.did}/${assertCanonicalResourceUri(post.uri).rkey}#main`);

	const isAviBlurred = $derived(!!findLabel(author.labels, author.did, FlagsBlurMedia));
	const blur = $derived(findLabel(post.labels, author.did, FlagsBlurContent));
</script>

<details open={!defaultCollapsed} class="post-descendant-item">
	<summary class="header">
		<Avatar profile={author} size="xs" blur={isAviBlurred} />
		<PostMeta {post} {postUrl} {authorUrl} />
	</summary>

	<div class="contents">
		<ContentHider {blur}>
			<RichtextRenderer text={record.text} facets={record.facets} />

			{#if post.embed}
				<Embeds {post} embed={post.embed} />
			{/if}
		</ContentHider>

		<PostMetrics {post} />

		{#if hasDescendant}
			<div class="descendant-line"></div>
		{/if}
	</div>

	{#if hasDescendant}
		<details open class="descendants">
			<summary aria-label="Show/hide replies" class="descendant-summary">
				<div class="descendant-summary-button">
					<div class="descendant-summary-icon is-opened">
						<CircleMinusOutlined />
					</div>

					<div class="descendant-summary-icon is-closed">
						<CirclePlusOutlined />
					</div>
				</div>
			</summary>

			<div class={['descendant-items', isNested && 'has-multiple']}>
				{@render children?.()}
			</div>
		</details>
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
		padding: 12px 16px;
		list-style: none;

		.post-descendant-item:not([open]) & {
			opacity: 0.5;
		}

		&::-webkit-details-marker {
			display: none;
		}

		&:focus-visible {
			outline-offset: -2px;
		}
	}

	.contents {
		display: flex;
		position: relative;
		flex-direction: column;
		margin: -10px 0 0 0;
		padding: 0 16px 12px calc(20px + 16px + 8px);

		& > :global(.content-hider) {
			margin: 8px 0 0 0;
		}
	}

	.descendant-line {
		position: absolute;
		top: 0;
		bottom: -10px;
		left: calc(16px + (20px / 2) - 1px);
		border-left: 2px solid var(--divider-md);

		.post-descendant-item:has(> .descendants:not([open])) & {
			bottom: 16px;
		}
	}

	.descendants {
		position: relative;
	}

	.descendant-summary {
		list-style: none;
	}

	.descendant-summary-button {
		position: absolute;
		top: -32px;
		z-index: 1;
		margin-left: 16px;
		border-radius: 9999px;
		background: var(--bg-primary);
		width: 20px;
		height: 20px;
		color: var(--text-blurb);

		@media (hover: hover) {
			&:hover {
				background: color-mix(in srgb, var(--bg-primary), var(--tap) 10%);
			}
		}
	}

	.descendant-summary-icon {
		display: grid;
		place-items: center;
		width: 20px;
		height: 20px;
		/* font-size: 16px; */

		&.is-opened {
			display: none;
		}

		&.is-closed {
			display: grid;
		}

		.descendants[open] > .descendant-summary & {
			&.is-opened {
				display: grid;
			}

			&.is-closed {
				display: none;
			}
		}
	}

	.descendant-items {
		&.has-multiple {
			display: grid;
			grid-template-columns: 20px minmax(0, 1fr);
		}
	}
</style>
