<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import PageContainer from '$lib/components/page/page-container.svelte';
	import PageHeader from '$lib/components/page/page-header.svelte';
	import PageListing from '$lib/components/page/page-listing.svelte';
	import ProfileItem from '$lib/components/profiles/profile-item.svelte';

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Post reposted by — {PUBLIC_APP_NAME}</title>
</svelte:head>

<PageContainer>
	<PageHeader title="Reposted by" />

	<PageListing subject="profiles" root={!page.url.searchParams.get('cursor')} cursor={data.reposts.cursor}>
		{#each data.reposts.items as profile (profile.did)}
			<ProfileItem item={profile} />
		{/each}
	</PageListing>
</PageContainer>
