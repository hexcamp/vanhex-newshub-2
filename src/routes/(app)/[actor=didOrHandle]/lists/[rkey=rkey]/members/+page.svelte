<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import ProfileItem from '$lib/components/profiles/profile-item.svelte';

	const { data }: PageProps = $props();

	const { rootUrl, nextUrl } = $derived(paginate(page.url, data.members.cursor));

	const title = $derived.by(() => {
		const list = data.list;
		const creator = list.creator;

		return `Members in ${list.name} by @${creator.handle} — ${PUBLIC_APP_NAME}`;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<PageListing subject="profiles" {rootUrl} {nextUrl}>
	{#each data.members.items as item (item.subject.did)}
		<ProfileItem item={item.subject} />
	{/each}
</PageListing>
