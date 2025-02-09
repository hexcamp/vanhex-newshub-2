<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import PostFeedItem from '$lib/components/timeline/post-feed-item.svelte';

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>@{data.profile.handle} — {PUBLIC_APP_NAME}</title>
</svelte:head>

<PageListing subject="timeline" root={!page.url.searchParams.get('cursor')} cursor={data.timeline.cursor}>
	{#each data.timeline.items as item (item.id)}
		<PostFeedItem {item} />
	{/each}
</PageListing>
