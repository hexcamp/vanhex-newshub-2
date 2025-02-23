<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import ListItem from '$lib/components/lists/list-item.svelte';
	import PageHeader from '$lib/components/page/page-header.svelte';
	import PageListing from '$lib/components/page/page-listing.svelte';

	const { data }: PageProps = $props();

	const { rootUrl, nextUrl } = $derived(
		paginate(page.url, data.lists.cursor, `${base}/${data.profile.did}/lists`),
	);
</script>

<svelte:head>
	<title>Lists by @{data.profile.handle} — {PUBLIC_APP_NAME}</title>
</svelte:head>

<PageHeader title="Lists" />

<PageListing subject="lists" {rootUrl} {nextUrl}>
	{#each data.lists.items as list (list.uri)}
		<ListItem item={list} />
	{/each}
</PageListing>
