<script lang="ts" module>
	import { segmentize, type Facet, type FacetFeature } from '@atcute/bluesky-richtext-segmenter';

	const grabFirstSupported = (features: FacetFeature[] | undefined): FacetFeature | undefined => {
		return features?.find(
			(feature) =>
				feature.$type === 'app.bsky.richtext.facet#link' ||
				feature.$type === 'app.bsky.richtext.facet#mention' ||
				feature.$type === 'app.bsky.richtext.facet#tag',
		);
	};
</script>

<script lang="ts">
	import { base } from '$app/paths';

	import { redirectBskyUrl } from '$lib/redirector';
	import { safeUrlParse } from '$lib/utils/url';

	interface Props {
		text: string;
		facets?: Facet[];
		large?: boolean;
	}

	const { text, facets, large }: Props = $props();
</script>

<p class={`rich-text` + (large ? ` is-large` : ` is-small`)}>
	{#each segmentize(text, facets) as segment}
		{@const feature = grabFirstSupported(segment.features)}

		{#if !feature}
			{segment.text}
		{:else if feature.$type === 'app.bsky.richtext.facet#link'}
			{@const parsed = safeUrlParse(feature.uri)}

			{#if parsed === null}
				{segment.text}
			{:else}
				{@const redir = redirectBskyUrl(parsed)}

				{#if redir && redir.type === 'internal'}
					<a href={redir.url} class="link">{segment.text}</a>
				{:else}
					<a target="_blank" href={redir ? redir.url : parsed.href} rel="noopener nofollow" class="link"
						>{segment.text}</a
					>
				{/if}
			{/if}
		{:else if feature.$type === 'app.bsky.richtext.facet#mention'}
			<a href="{base}/{feature.did}" class="mention">{segment.text}</a>
		{:else if feature.$type === 'app.bsky.richtext.facet#tag'}
			<a href="{base}/search/posts?q={encodeURIComponent('#' + feature.tag)}" class="hashtag"
				>{segment.text}</a
			>
		{/if}
	{/each}
</p>

<style>
	.rich-text {
		margin: -2px;
		padding: 2px;
		overflow: hidden;
		white-space: pre-wrap;
		overflow-wrap: break-word;

		&:empty {
			display: none;
		}
	}
	.is-large {
		font-size: 1rem;
		line-height: 1.5rem;
	}

	.link,
	.mention,
	.hashtag {
		color: var(--text-link);

		&:hover {
			text-decoration: underline;
		}
	}
</style>
