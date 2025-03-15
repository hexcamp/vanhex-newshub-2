<script lang="ts">
	import type { AppBskyFeedPost } from '@atcute/client/lexicons';

	import { base } from '$app/paths';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { parseAddressedAtUri } from '$lib/types/at-uri';
	import { truncateMiddle, truncateRight } from '$lib/utils/strings';

	import BlockedAscendantItem from './components/blocked-ascendant-item.svelte';
	import Descendants from './components/descendants.svelte';
	import MainPost from './components/main-post.svelte';
	import MissingDescendantItem from './components/missing-descendant-item.svelte';
	import NonexistentAscendantPost from './components/nonexistent-ascendant-post.svelte';
	import OverflowAscendantItem from './components/overflow-ascendant-item.svelte';
	import PostAscendantItem from './components/post-ascendant-item.svelte';

	import PostMetaTags from './components/post-meta-tags.svelte';
	import { getAncestors } from './utils';

	const { data }: PageProps = $props();

	const main = $derived(data.thread.post);
	const uri = $derived(parseAddressedAtUri(main.uri));

	const title = $derived.by(() => {
		const author = `@${truncateMiddle(main.author.handle, 29)}`;
		const content = truncateRight((main.record as AppBskyFeedPost.Record).text.trim(), 70);

		return `${author}: "${content}" — ${PUBLIC_APP_NAME}`;
	});

	const ancestors = $derived(getAncestors(data.thread));

	const missingReplyCount = $derived.by(() => {
		return (main.replyCount ?? 0) - (data.thread.replies?.length ?? 0);
	});
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="canonical" href="https://bsky.app/profile/{uri.repo}/post/{uri.rkey}" />
	<link rel="alternate" href={main.uri} />
</svelte:head>

<PostMetaTags post={main} />

<div class="thread-page">
	<div class="ancestors">
		{#each ancestors as item}
			{#if item.type === 'post'}
				<PostAscendantItem {item} />
			{:else if item.type === 'overflow'}
				{@const uri = parseAddressedAtUri(item.uri)}

				<OverflowAscendantItem postUrl="{base}/{uri.repo}/{uri.rkey}#main" />
			{:else if item.type === 'blocked'}
				{@const uri = parseAddressedAtUri(item.uri)}

				<BlockedAscendantItem postUrl="{base}/{uri.repo}/{uri.rkey}#main" />
			{:else if item.type === 'nonexistent'}
				{@const uri = parseAddressedAtUri(item.uri)}

				<NonexistentAscendantPost postUrl="{base}/{uri.repo}/{uri.rkey}#main" />
			{/if}
		{/each}
	</div>

	<div class="thread">
		<div class="main" id="main">
			<MainPost post={main} threadgate={data.threadgate} prev={ancestors.length > 0} />
		</div>

		<div class="descendants">
			<!-- thanks Svelte for your whitespace handling -->
			<!-- prettier-ignore -->
			<Descendants thread={data.thread} threadgate={data.threadgate} />{#if missingReplyCount > 0}
				<MissingDescendantItem count={missingReplyCount} post={main} />
			{/if}
		</div>
	</div>
</div>

<style>
	.thread-page {
		display: flex;
		flex-direction: column;
		margin: 24px auto;
		width: 100%;
		max-width: 600px;
	}

	.thread {
		min-height: calc(100dvh - (24px * 2));
	}

	.main,
	.ancestors,
	.descendants {
		background: var(--bg-primary);
	}

	.main {
		scroll-margin: 24px;
	}

	.ancestors {
		&:empty {
			display: none;
		}
	}

	.descendants {
		border-top: 1px solid var(--divider-md);
		padding: 4px 0;

		&:empty {
			display: none;
		}
	}
</style>
