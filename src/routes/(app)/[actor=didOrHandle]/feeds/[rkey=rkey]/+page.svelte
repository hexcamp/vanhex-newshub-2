<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { parseAtUri } from '$lib/types/at-uri';
	import { paginate } from '$lib/utils/pagination';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import PostFeedItem from '$lib/components/timeline/post-feed-item.svelte';

	const { data }: PageProps = $props();

	const canonical = $derived(`${base}/${data.feed.creator.did}/feeds/${parseAtUri(data.feed.uri).rkey}`);

	const { rootUrl, nextUrl } = $derived(paginate(page.url, data.timeline.cursor, canonical));
</script>

<svelte:head>
	<title>{data.feed.displayName} — {PUBLIC_APP_NAME}</title>
	<link rel="canonical" href={canonical} />
	<link rel="alternate" href={data.feed.uri} />
</svelte:head>

<PageListing subject="timeline" {rootUrl} {nextUrl}>
	{#each data.timeline.items as item (item.id)}
		<PostFeedItem {item} />
	{/each}
</PageListing>
