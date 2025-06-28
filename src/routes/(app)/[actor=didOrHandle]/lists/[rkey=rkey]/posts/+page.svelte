<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import PostFeedItem from '$lib/components/timeline/post-feed-item.svelte';
	import { assertCanonicalResourceUri } from '$lib/types/at-uri';

	const { data }: PageProps = $props();

	const uri = $derived(assertCanonicalResourceUri(data.list.uri));

	const { rootUrl, nextUrl } = $derived(
		paginate(page.url, data.timeline.cursor, `${base}/${uri.repo}/lists/${uri.rkey}/posts`),
	);

	const title = $derived.by(() => {
		const list = data.list;
		const creator = list.creator;

		return `${list.name} by @${creator.handle} — ${PUBLIC_APP_NAME}`;
	});
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="alternate" href="{base}/{uri.repo}/lists/{uri.rkey}/posts/rss" type="application/rss+xml" />
</svelte:head>

<PageListing subject="timeline" {rootUrl} {nextUrl}>
	{#each data.timeline.items as item (item.id)}
		<PostFeedItem {item} />
	{/each}
</PageListing>
