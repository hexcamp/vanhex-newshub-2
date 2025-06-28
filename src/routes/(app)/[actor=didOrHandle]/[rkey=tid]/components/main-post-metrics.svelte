<script lang="ts">
	import type { AppBskyFeedDefs } from '@atcute/bluesky';

	import { base } from '$app/paths';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { formatCompactNumber } from '$lib/utils/intl/number';

	interface Props {
		post: AppBskyFeedDefs.PostView;
	}

	const { post }: Props = $props();

	const baseUrl = $derived(`${base}/${post.author.did}/${assertCanonicalResourceUri(post.uri).rkey}`);
</script>

{#snippet Stat(count: number | undefined, one: string, many: string, href: string)}
	{#if count !== undefined && count > 0}
		<a {href} class="stat">
			<span class="count">{formatCompactNumber(count)}</span>
			<span class="label"> {count === 1 ? one : many}</span>
		</a>
	{/if}
{/snippet}

{#if post.repostCount || post.quoteCount || post.likeCount}
	<div class="main-post-metrics">
		{@render Stat(post.repostCount, 'repost', 'reposts', `${baseUrl}/reposts`)}
		{@render Stat(post.quoteCount, 'quote', 'quotes', `${baseUrl}/quotes`)}
		{@render Stat(post.likeCount, 'like', 'likes', `${baseUrl}/likes`)}
	</div>
{/if}

<style>
	.main-post-metrics {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		border-top: 1px solid var(--divider-md);
		padding: 16px 0;

		&:empty {
			display: none;
		}
	}

	.stat {
		color: var(--text-primary);

		&:hover {
			text-decoration: underline;
		}
	}

	.count {
		font-weight: 600;
	}
	.label {
		color: var(--text-blurb);
	}
</style>
