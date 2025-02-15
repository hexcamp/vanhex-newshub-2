<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { paginate } from '$lib/utils/pagination';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import PostFeedItem from '$lib/components/timeline/post-feed-item.svelte';

	const { data }: PageProps = $props();

	const { rootUrl, nextUrl } = $derived(
		paginate(page.url, data.timeline.cursor, `${base}/${data.profile.did}/with_replies`),
	);

	const title = $derived.by(() => {
		let str = ``;

		if (data.profile.displayName?.trim()) {
			str += `${data.profile.displayName.trim()} (@${data.profile.handle})`;
		} else {
			str += `@${data.profile.handle}`;
		}

		str += ` — ${PUBLIC_APP_NAME}`;
		return str;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<PageListing subject="timeline" {rootUrl} {nextUrl}>
	{#each data.timeline.items as item (item.id)}
		<PostFeedItem {item} />
	{/each}
</PageListing>
