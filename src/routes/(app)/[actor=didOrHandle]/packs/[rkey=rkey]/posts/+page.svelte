<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import PostFeedItem from '$lib/components/timeline/post-feed-item.svelte';
	import { parseAddressedAtUri } from '$lib/types/at-uri';

	const { data }: PageProps = $props();

	const uri = $derived(parseAddressedAtUri(data.pack.uri));

	const { rootUrl, nextUrl } = $derived(
		paginate(page.url, data.timeline.cursor, `${base}/${uri.repo}/packs/${uri.rkey}/posts`),
	);
</script>

<PageListing subject="timeline" {rootUrl} {nextUrl}>
	{#each data.timeline.items as item (item.id)}
		<PostFeedItem {item} />
	{/each}
</PageListing>
