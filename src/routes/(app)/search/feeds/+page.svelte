<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import FeedItem from '$lib/components/feeds/feed-item.svelte';
	import PageListing from '$lib/components/page/page-listing.svelte';

	const { data }: PageProps = $props();

	const { rootUrl, nextUrl } = $derived(paginate(page.url, data.feeds.cursor));
</script>

<svelte:head>
	<title>Searching feeds with "{data.query}" — {PUBLIC_APP_NAME}</title>
</svelte:head>

<PageListing subject="feeds" {rootUrl} {nextUrl}>
	{#each data.feeds.items as feed (feed.uri)}
		<FeedItem item={feed} />
	{/each}
</PageListing>
