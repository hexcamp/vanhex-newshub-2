<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import PageContainer from '$lib/components/page/page-container.svelte';
	import PageHeader from '$lib/components/page/page-header.svelte';
	import PageListing from '$lib/components/page/page-listing.svelte';
	import PostFeedItem from '$lib/components/timeline/post-feed-item.svelte';

	const { data }: PageProps = $props();

	const { rootUrl, nextUrl } = $derived(paginate(page.url, data.quotes.cursor));
</script>

<svelte:head>
	<title>Quotes — {PUBLIC_APP_NAME}</title>
</svelte:head>

<PageContainer>
	<PageHeader title="Quotes" />

	<PageListing subject="posts" {rootUrl} {nextUrl}>
		{#each data.quotes.items as post (post.uri)}
			<PostFeedItem
				item={{
					id: post.uri,
					post,
					reply: undefined,
					reason: undefined,
					next: false,
					prev: false,
				}}
			/>
		{/each}
	</PageListing>
</PageContainer>
