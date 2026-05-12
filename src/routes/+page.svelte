<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { paginate } from '$lib/utils/pagination';

	import PageListing from '$lib/components/page/page-listing.svelte';
	import PostFeedItemSplash from '$lib/components/timeline/post-feed-item-splash.svelte';
	import PostFeedItemNoImage from '$lib/components/timeline/post-feed-item-no-image.svelte';
	import PostFeedItemWithImage from '$lib/components/timeline/post-feed-item-with-image.svelte';

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

	/*
	(() => {
		console.log('Jim Original Timeline', data.timeline);
		for (const i in filteredTimeline.items) {
			console.log('Jim Item', i, filteredTimeline.items[i].post.record);
		}
	})();
	*/

	const { rootUrl, nextUrl } = $derived(paginate(page.url, filteredTimeline.cursor, base));
</script>

<svelte:head>
	<title>{data.feed.displayName} by @{data.feed.creator.handle} — {PUBLIC_APP_NAME}</title>
	<link rel="canonical" href={base} />
	<link rel="alternate" href={data.feed.uri} />
</svelte:head>

<FeedMetaTags feed={data.feed} />

<PageListing subject="timeline" {rootUrl} {nextUrl}>
	<section class="grid-section">
		<div class="grid1">
			<div class="grid1-1">
				{#if filteredTimeline.items[0]}
					<PostFeedItemSplash item={filteredTimeline.items[0]} />
				{/if}
			</div>
			<div class="grid1-2">
				<div class="subgrid1-2">
					<div class="subgrid1-2-1">
						{#if filteredTimeline.items[1]}
							<PostFeedItemWithImage item={filteredTimeline.items[1]} />
						{/if}
					</div>
					<div class="subgrid1-2-2">
						{#if filteredTimeline.items[2]}
							<PostFeedItemWithImage item={filteredTimeline.items[2]} />
						{/if}
					</div>
					<div class="subgrid1-2-3">
						{#if filteredTimeline.items[3]}
							<PostFeedItemWithImage item={filteredTimeline.items[3]} />
						{/if}
					</div>
				</div>
			</div>
			<div class="grid1-3">
				<div class="subgrid1-3">
					<div class="subgrid1-3-1">
						{#if filteredTimeline.items[4]}
							<PostFeedItemWithImage item={filteredTimeline.items[4]} />
						{/if}
					</div>
					<div class="subgrid1-3-2">
						{#if filteredTimeline.items[5]}
							<PostFeedItemWithImage item={filteredTimeline.items[5]} />
						{/if}
					</div>
					<div class="subgrid1-3-3">
						{#if filteredTimeline.items[6]}
							<PostFeedItemWithImage item={filteredTimeline.items[6]} />
						{/if}
					</div>
					<div class="subgrid1-3-4">
						{#if filteredTimeline.items[7]}
							<PostFeedItemWithImage item={filteredTimeline.items[7]} />
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>
</PageListing>

<style>
	.grid-section {
	}

	.grid1 {
		display: grid;
		grid-template-rows: min-content minmax(0px, 1fr);
		grid-template-columns: repeat(24, 1fr);
		grid-auto-flow: row;
		gap: 32px 16px;
		margin-inline: 16px;
		width: 100%;
		max-width: calc(1248px);
	}

	@media screen and (max-width: 1279px) {
		.grid1 {
			max-width: calc(100% - 32px);
		}
	}

	@media screen and (max-width: 1007px) {
		.grid1 {
			grid-template-rows: repeat(2, min-content) minmax(0px, 1fr);
		}
	}

	@media screen and (max-width: 767px) {
		.grid1 {
			grid-template-rows: unset;
		}
	}

	/*
	@media screen and (max-width: 599px) {
		.grid1 {
			grid-template-columns: repeat(12, 1fr);
		}
	}
	*/

	.grid1-1 {
		grid-column: 1 / span 18;
	}

	@media screen and (max-width: 767px) {
		.grid1-1 {
			display: initial;
		}
	}

	@media screen and (max-width: 1007px) {
		.grid1-1 {
			display: initial;
		}
	}

	@media screen and (max-width: 1007px) {
		.grid1-1 {
			grid-column: 1 / span 16;
		}
	}

	@media screen and (max-width: 767px) {
		.grid1-1 {
			grid-column: 1 / span 24;
		}
	}

	@media screen and (max-width: 599px) {
		.grid1-1 {
			display: initial;
		}
	}

	/*
	@media screen and (max-width: 599px) {
		.grid1-1 {
			grid-column: 1 / span 12;
		}
	}
	*/

	.grid1-2 {
		grid-area: 1 / 19 / span 2 / span 6;
	}

	@media screen and (max-width: 1007px) {
		.grid1-2 {
			grid-row: 1 / span 3;
		}
	}

	@media screen and (max-width: 1007px) {
		.grid1-2 {
			grid-column: 17 / span 8;
		}
	}

	@media screen and (max-width: 1007px) {
		.grid1-2 {
			display: initial;
		}
	}

	@media screen and (max-width: 767px) {
		.grid1-2 {
			grid-column: 1 / span 1;
		}
	}

	@media screen and (max-width: 767px) {
		.grid1-2 {
			display: contents;
		}
	}

	.subgrid1-2 {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-auto-flow: row;
		gap: 16px;
		width: 100%;
		min-width: fit-content;
		max-width: calc(1248px);
	}

	@media screen and (max-width: 1279px) {
		.subgrid1-2 {
			max-width: min(100% - 32px, 1008px);
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-2 {
			grid-template-columns: repeat(8, 1fr);
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-2 {
			display: grid;
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-2 {
			max-width: min(100% - 32px, 722px);
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2 {
			display: contents;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2 {
			max-width: calc(100% - 32px);
		}
	}

	.subgrid1-2-1 {
		grid-column: 1 / span 6;
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-2-1 {
			display: initial;
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-2-1 {
			grid-column: 1 / span 8;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2-1 {
			display: initial;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2-1 {
			grid-row: 2 / span 1;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2-1 {
			grid-column: 1 / span 12;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-2-1 {
			grid-column: 1 / span 24;
		}
	}

	.subgrid1-2-2 {
		grid-column: 1 / span 6;
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-2-2 {
			display: initial;
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-2-2 {
			grid-column: 1 / span 8;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2-2 {
			display: initial;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2-2 {
			grid-row: 2 / span 1;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2-2 {
			grid-column: 13 / span 12;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-2-2 {
			grid-row: 3 / span 1;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-2-2 {
			grid-column: 1 / span 24;
		}
	}

	.subgrid1-2-3 {
		grid-column: 1 / span 6;
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-2-3 {
			display: initial;
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-2-3 {
			grid-column: 1 / span 8;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2-3 {
			display: initial;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2-3 {
			grid-row: 3 / span 1;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-2-3 {
			grid-column: 1 / span 12;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-2-3 {
			grid-row: 4 / span 1;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-2-3 {
			grid-column: 1 / span 24;
		}
	}

	.grid1-3 {
		grid-column: 1 / span 18;
	}

	@media screen and (max-width: 1007px) {
		.grid1-3 {
			display: contents;
		}
	}

	@media screen and (max-width: 1007px) {
		.grid1-3 {
			grid-column: 1 / span 1;
		}
	}

	.subgrid1-3 {
		display: grid;
		grid-template-columns: repeat(20, 1fr);
		grid-auto-flow: row;
		column-gap: 16px;
		width: 100%;
		min-width: fit-content;
		max-width: calc(1248px);
	}

	@media screen and (max-width: 1279px) {
		.subgrid1-3 {
			max-width: min(100% - 32px, 1008px);
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3 {
			display: contents;
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3 {
			max-width: min(100% - 32px, 1008px);
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3 {
			display: contents;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3 {
			max-width: calc(100% - 32px);
		}
	}

	.subgrid1-3-1 {
		grid-column: 1 / span 5;
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3-1 {
			display: initial;
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3-1 {
			grid-column: 1 / span 8;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-1 {
			display: initial;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-1 {
			grid-row: 4 / span 1;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-1 {
			grid-column: 1 / span 12;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-3-1 {
			grid-column: 1 / span 24;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-3-1 {
			grid-row: 5 / span 1;
		}
	}

	.subgrid1-3-2 {
		grid-column: 6 / span 5;
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3-2 {
			display: initial;
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3-2 {
			grid-column: 9 / span 8;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-2 {
			display: initial;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-2 {
			grid-row: 4 / span 1;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-2 {
			grid-column: 13 / span 12;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-3-2 {
			grid-column: 1 / span 24;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-3-2 {
			grid-row: 6 / span 1;
		}
	}

	.subgrid1-3-3 {
		grid-column: 11 / span 5;
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3-3 {
			display: initial;
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3-3 {
			grid-column: 1 / span 8;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-3 {
			display: initial;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-3 {
			grid-row: 5 / span 1;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-3 {
			grid-column: 1 / span 12;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-3-3 {
			grid-column: 1 / span 24;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-3-3 {
			grid-row: 7 / span 1;
		}
	}

	.subgrid1-3-4 {
		grid-column: 16 / span 5;
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3-4 {
			display: initial;
		}
	}

	@media screen and (max-width: 1007px) {
		.subgrid1-3-4 {
			grid-column: 9 / span 8;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-4 {
			display: initial;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-4 {
			grid-row: 5 / span 1;
		}
	}

	@media screen and (max-width: 767px) {
		.subgrid1-3-4 {
			grid-column: 13 / span 12;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-3-4 {
			grid-column: 1 / span 24;
		}
	}

	@media screen and (max-width: 599px) {
		.subgrid1-3-4 {
			grid-row: 8 / span 1;
		}
	}
</style>
