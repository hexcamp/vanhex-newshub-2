<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { paginate } from '$lib/utils/pagination';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import PostFeedItem from '$lib/components/timeline/post-feed-item.svelte';

	import FeedMetaTags from './components/feed-meta-tags.svelte';

	const { data }: PageProps = $props();

	let dedupe = $state(true);

	const rkey = $derived(assertCanonicalResourceUri(data.feed.uri).rkey);

	let filteredTimeline = $derived({
		...data.timeline,
		items: (() => {
			const seen = new Set();
			return data.timeline.items.slice(0, 100).filter((item) => {
				const text = <string>item.post.record?.text;
				if (dedupe && seen.has(text)) {
					return false;
				}
				const embed = <Record<string, object>>item.post.record?.embed;
				const external = <Record<string, string>>embed?.external;
				if (dedupe && seen.has(external?.title)) {
					return false;
				}
				seen.add(text);
				if (external?.title) {
					seen.add(external?.title);
				}
				return true;
			});
		})(),
	});

	(() => {
		console.log('Jim Original Timeline', data.timeline);
		for (const i in filteredTimeline.items) {
			console.log('Jim Item', i, filteredTimeline.items[i].post.record);
		}
	})();

	const { rootUrl, nextUrl } = $derived(paginate(page.url, filteredTimeline.cursor, base));
</script>

<svelte:head>
	<title>{data.feed.displayName} by @{data.feed.creator.handle} — {PUBLIC_APP_NAME}</title>
	<link rel="canonical" href={base} />
	<link rel="alternate" href={data.feed.uri} />
</svelte:head>

<div style="margin-bottom: 0.8rem">
	<label>
		<input type="checkbox" bind:checked={dedupe} />
		De-duplicate articles
	</label>
</div>
<FeedMetaTags feed={data.feed} />

<PageListing subject="timeline" {rootUrl} {nextUrl}>
	{#each filteredTimeline.items as item (item.id)}
		<PostFeedItem {item} />
	{/each}
</PageListing>
