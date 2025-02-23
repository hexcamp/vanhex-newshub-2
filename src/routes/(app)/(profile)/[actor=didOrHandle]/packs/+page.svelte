<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import PageHeader from '$lib/components/page/page-header.svelte';
	import PageListing from '$lib/components/page/page-listing.svelte';
	import StarterpackItem from '$lib/components/starterpacks/starterpack-item.svelte';

	const { data }: PageProps = $props();

	const { rootUrl, nextUrl } = $derived(
		paginate(page.url, data.packs.cursor, `${base}/${data.profile.did}/packs`),
	);
</script>

<svelte:head>
	<title>Starter packs by @{data.profile.handle} — {PUBLIC_APP_NAME}</title>
</svelte:head>

<PageHeader title="Starter packs" />

<PageListing subject="packs" {rootUrl} {nextUrl}>
	{#each data.packs.items as pack (pack.uri)}
		<StarterpackItem item={pack} />
	{/each}
</PageListing>
