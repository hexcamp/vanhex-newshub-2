<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import FeedItem from '$lib/components/feeds/feed-item.svelte';
	import PageHeader from '$lib/components/page/page-header.svelte';
	import PageListing from '$lib/components/page/page-listing.svelte';

	const { data }: PageProps = $props();

	const { rootUrl, nextUrl } = $derived(paginate(page.url, data.feeds.cursor));
</script>

<svelte:head>
	<title>Feeds by @{data.profile.handle} — {PUBLIC_APP_NAME}</title>
	<link rel="canonical" href="{base}/{data.profile.did}" />
</svelte:head>

<PageHeader title="Feeds" />

<PageListing subject="feeds" {rootUrl} {nextUrl}>
	{#each data.feeds.items as feed (feed.uri)}
		<FeedItem item={feed} />
	{/each}
</PageListing>
