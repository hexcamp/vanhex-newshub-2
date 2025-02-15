<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import ProfileItem from '$lib/components/profiles/profile-item.svelte';

	const { data }: PageProps = $props();

	const { rootUrl, nextUrl } = $derived(paginate(page.url, data.profiles.cursor));
</script>

<svelte:head>
	<title>Searching users with "{data.query}" — {PUBLIC_APP_NAME}</title>
</svelte:head>

<PageListing subject="profiles" {rootUrl} {nextUrl}>
	{#each data.profiles.items as profile (profile.did)}
		<ProfileItem item={profile} />
	{/each}
</PageListing>
