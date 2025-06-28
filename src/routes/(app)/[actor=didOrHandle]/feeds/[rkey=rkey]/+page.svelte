<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { paginate } from '$lib/utils/pagination';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import PostFeedItem from '$lib/components/timeline/post-feed-item.svelte';

	import FeedMetaTags from './components/feed-meta-tags.svelte';

	const { data }: PageProps = $props();

	const rkey = $derived(assertCanonicalResourceUri(data.feed.uri).rkey);

	const { rootUrl, nextUrl } = $derived(
		paginate(page.url, data.timeline.cursor, `${base}/${data.feed.creator.did}/feeds/${rkey}`),
	);
</script>

<svelte:head>
	<title>{data.feed.displayName} by @{data.feed.creator.handle} — {PUBLIC_APP_NAME}</title>
	<link rel="canonical" href="{base}/{data.feed.creator.did}/feeds/{rkey}" />
	<link rel="alternate" href={data.feed.uri} />
</svelte:head>

<FeedMetaTags feed={data.feed} />

<PageListing subject="timeline" {rootUrl} {nextUrl}>
	{#each data.timeline.items as item (item.id)}
		<PostFeedItem {item} />
	{/each}
</PageListing>
