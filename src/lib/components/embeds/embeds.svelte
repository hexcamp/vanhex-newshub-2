<script lang="ts">
	import type { AppBskyFeedDefs } from '@atcute/client/lexicons';

	import { findLabel, FlagsBlurMedia } from '$lib/moderation';
	import { parseAtUri } from '$lib/types/at-uri';
	import { unwrapEmbedView, type MediaEmbed, type RecordEmbed } from '$lib/utils/bluesky/embeds';
	import { collectionToLabel } from '$lib/utils/bluesky/records';

	import ContentHider from '../content-hider.svelte';

	import ExternalEmbed from './external-embed.svelte';
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

	const { media, record } = $derived(unwrapEmbedView(embed));
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
	{@const record = embed.record}

	{#if record.$type === 'app.bsky.embed.record#viewRecord'}
		<QuoteEmbed embed={record} {large} />
	{:else if record.$type === 'app.bsky.feed.defs#generatorView'}
		<FeedEmbed embed={record} />
	{:else if record.$type === 'app.bsky.graph.defs#listView'}
		<ListEmbed embed={record} />
	{:else if record.$type === 'app.bsky.graph.defs#starterPackViewBasic'}
		<StarterpackEmbed embed={record} {large} />
	{:else}
		{@const uri = parseAtUri(record.uri)}

		{#if uri.collection === 'app.bsky.feed.post' && (record.$type === 'app.bsky.embed.record#viewBlocked' || record.$type === 'app.bsky.embed.record#viewDetached')}
			<QuoteBlockedEmbed embed={record} {uri} />
		{:else}
			{@const resource = collectionToLabel(uri.collection)}
			{@const isUnavailable =
				resource &&
				(record.$type === 'app.bsky.embed.record#viewNotFound' ||
					record.$type === 'app.bsky.embed.record#viewBlocked')}

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
