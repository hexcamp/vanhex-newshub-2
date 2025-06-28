<script lang="ts">
	import { unwrapMediaEmbed, type AppBskyEmbedRecord, type AppBskyFeedPost } from '@atcute/bluesky';

	import { base } from '$app/paths';

	import { findLabel, FlagsBlurContent, FlagsBlurMedia } from '$lib/moderation';
	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { trimRichText } from '$lib/utils/bluesky/richtext';

	import Avatar from '$lib/components/avatar.svelte';
	import Time from '$lib/components/islands/time.svelte';

	import ContentHider from '../content-hider.svelte';

	import ImageEmbed from './image-embed.svelte';
	import VideoThumbnailEmbed from './video-thumbnail-embed.svelte';

	interface Props {
		embed: AppBskyEmbedRecord.ViewRecord;
		large?: boolean;
	}

	const { embed: quote, large = false }: Props = $props();

	const record = $derived(quote.value as AppBskyFeedPost.Main);
	const text = $derived(trimRichText(record.text));

	const author = $derived(quote.author);
	const authorName = $derived(normalizeDisplayName(author.displayName ?? ''));

	const embed = $derived(quote.embeds?.[0]);
	const media = $derived(unwrapMediaEmbed(embed));

	const blurAvi = $derived(!!findLabel(author.labels, author.did, FlagsBlurMedia));
	const blurContent = $derived(findLabel(quote.labels, author.did, FlagsBlurContent));
	const blurMedia = $derived(!!findLabel(quote.labels, author.did, FlagsBlurMedia));
</script>

<ContentHider blur={blurContent}>
	<a href="{base}/{author.did}/{assertCanonicalResourceUri(quote.uri).rkey}#main" class="quote-embed">
		<div class="meta">
			<Avatar profile={author} src={author.avatar} size="xs" blur={blurAvi} />

			<span class="name-wrapper">
				{#if authorName}
					<bdi class="display-name-wrapper">
						<span class="display-name">{authorName}</span>
					</bdi>
				{/if}

				<span class="handle">@{author.handle}</span>
			</span>

			<span aria-hidden="true" class="dot">·</span>

			<span class="date">
				<Time date={record.createdAt} format="relative-time" />
			</span>
		</div>

		{#if text}
			<div class="body">
				{#if !large && media}
					{#if media.$type === 'app.bsky.embed.images#view'}
						<div class="aside">
							<ImageEmbed embed={media} blur={blurMedia} />
						</div>
					{:else if media.$type === 'app.bsky.embed.video#view'}
						<div class="aside">
							<VideoThumbnailEmbed embed={media} blur={blurMedia} />
						</div>
					{/if}
				{/if}

				<p class="text">{text}</p>
			</div>
		{:else}
			<div class="divide"></div>
		{/if}

		{#if (large || !text) && media}
			{#if media.$type === 'app.bsky.embed.images#view'}
				<ImageEmbed embed={media} borderless blur={blurMedia} />
			{:else if media.$type === 'app.bsky.embed.video#view'}
				<VideoThumbnailEmbed embed={media} borderless blur={blurMedia} />
			{/if}
		{/if}
	</a>
</ContentHider>

<style>
	.quote-embed {
		display: block;
		outline-offset: -1px;
		border: 1px solid var(--divider-md);
		border-radius: 6px;
		overflow: hidden;
		color: var(--text-primary);

		&:hover {
			background: var(--tap-sm);
		}
	}

	.meta {
		display: flex;
		padding: 12px 12px 0 12px;
		color: var(--text-blurb);
	}

	.name-wrapper {
		display: flex;
		gap: 4px;
		margin: 0 0 0 8px;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.display-name-wrapper {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.display-name {
		color: var(--text-primary);
		font-weight: 700;
	}
	.handle {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dot {
		flex-shrink: 0;
		margin: 0 6px;
	}

	.date {
		white-space: nowrap;
	}

	.body {
		display: flex;
		align-items: flex-start;
	}

	.aside {
		flex-grow: 1;
		flex-basis: 0;
		margin: 8px 0 12px 12px;
		max-width: 20%;
	}

	.text {
		display: -webkit-box;
		margin: 8px 12px 12px 12px;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 6;
		line-clamp: 6;
		flex-grow: 4;
		flex-basis: 0px;
		min-width: 0px;
		white-space: pre-wrap;
		overflow-wrap: break-word;
	}

	.divide {
		padding: 6px 0;
	}
</style>
