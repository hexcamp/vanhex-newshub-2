<script lang="ts">
	import { unwrapEmbed, type AppBskyFeedDefs, type MediaEmbed, type RecordEmbed } from '@atcute/bluesky';

	import { findLabel, FlagsBlurMedia } from '$lib/moderation';
	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { collectionToLabel } from '$lib/utils/bluesky/records';

	import ContentHider from '../content-hider.svelte';

	import ExternalEmbed from './external-embed-splash.svelte';
	import FeedEmbed from './feed-embed.svelte';
	import ImageEmbed from './image-embed.svelte';
	import ListEmbed from './list-embed.svelte';
	import QuoteBlockedEmbed from './quote-blocked-embed.svelte';
	import QuoteEmbed from './quote-embed.svelte';
	import StarterpackEmbed from './starterpack-embed.svelte';
	import VideoStandaloneEmbed from './video-standalone-embed.svelte';

	type Embed = NonNullable<AppBskyFeedDefs.PostView['embed']>;

	interface Props {
		embed: Embed;
		large?: boolean;
		post?: AppBskyFeedDefs.PostView;
	}

	const { embed, large = false, post }: Props = $props();

	const { media, record } = $derived(unwrapEmbed(embed));
</script>

<div class="embeds">
	{#if media}
		{@render Media(media)}
	{/if}
	{#if record}
		{@render Record(record)}
	{/if}
</div>

{#snippet Media(embed: MediaEmbed)}
	{@const blur = post && findLabel(post.labels, post.author.did, FlagsBlurMedia)}

	<ContentHider {blur}>
		{#if embed.$type === 'app.bsky.embed.external#view'}
			<ExternalEmbed {embed} />
		{:else if embed.$type === 'app.bsky.embed.images#view'}
			<ImageEmbed {embed} standalone />
		{:else if embed.$type === 'app.bsky.embed.video#view'}
			<VideoStandaloneEmbed {embed} />
		{:else}
			{@render Message(`Unsupported media embed`)}
		{/if}
	</ContentHider>
{/snippet}

{#snippet Record(embed: RecordEmbed)}
	{#if embed.$type === 'app.bsky.embed.record#viewRecord'}
		<QuoteEmbed {embed} {large} />
	{:else if embed.$type === 'app.bsky.feed.defs#generatorView'}
		<FeedEmbed {embed} />
	{:else if embed.$type === 'app.bsky.graph.defs#listView'}
		<ListEmbed {embed} />
	{:else if embed.$type === 'app.bsky.graph.defs#starterPackViewBasic'}
		<StarterpackEmbed {embed} {large} />
	{:else}
		{@const uri = assertCanonicalResourceUri(embed.uri)}

		{#if uri.collection === 'app.bsky.feed.post' && (embed.$type === 'app.bsky.embed.record#viewBlocked' || embed.$type === 'app.bsky.embed.record#viewDetached')}
			<QuoteBlockedEmbed {embed} {uri} />
		{:else}
			{@const resource = collectionToLabel(uri.collection)}
			{@const isUnavailable =
				resource &&
				(embed.$type === 'app.bsky.embed.record#viewNotFound' ||
					embed.$type === 'app.bsky.embed.record#viewBlocked')}

			{@render Message(isUnavailable ? `This ${resource} is unavailable` : `Unsupported record embed`)}
		{/if}
	{/if}
{/snippet}

{#snippet Message(message: string)}
	<div class="message">{message}</div>
{/snippet}

<style>
	.embeds {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 12px 0 0 0;
	}

	.message {
		border: 1px solid var(--divider-sm);
		border-radius: 6px;
		padding: 12px;
		color: var(--text-blurb);
	}
</style>
