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
			<a target="_blank" href={feature.uri} rel="noopener nofollow" class="link">{segment.text}</a>
		{:else if feature.$type === 'app.bsky.richtext.facet#mention'}
			<a href="{base}/{feature.did}" class="mention">{segment.text}</a>
		{:else if feature.$type === 'app.bsky.richtext.facet#tag'}
			<span class="hashtag">{segment.text}</span>
		{/if}
	{/each}
</p>

<style>
	.rich-text {
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
