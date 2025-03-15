<script lang="ts">
	import type { AppBskyFeedDefs } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { findLabel, FlagsBlurMedia } from '$lib/moderation';
	import { parseAddressedAtUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { truncateRight } from '$lib/utils/strings';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		embed: AppBskyFeedDefs.GeneratorView;
	}

	const { embed: feed }: Props = $props();

	const creator = $derived(feed.creator);

	const blurAvi = $derived(!!findLabel(feed.labels, creator.did, FlagsBlurMedia));
</script>

<a href="{base}/{creator.did}/feeds/{parseAddressedAtUri(feed.uri).rkey}" class="feed-embed">
	<div class="main">
		<Avatar type="generator" src={feed.avatar} blur={blurAvi} />

		<div class="info">
			<p class="name">{normalizeDisplayName(feed.displayName)}</p>
			<p class="creator">Feed by @{creator.handle}</p>
		</div>
	</div>

	<p class="description">{truncateRight(trimRichText(feed.description ?? ''), 190)}</p>
</a>

<style>
	.feed-embed {
		display: flex;
		flex-direction: column;
		gap: 12px;
		outline-offset: -1px;
		border: 1px solid var(--divider-md);
		border-radius: 6px;
		padding: 12px;
		color: var(--text-primary);

		&:hover {
			background: var(--tap-sm);
		}
	}

	.main {
		display: flex;
		gap: 12px;

		:global(.avatar) {
			margin: 2px;
		}
	}

	.info {
		min-width: 0;
		overflow-wrap: break-word;
	}
	.name {
		font-weight: 700;
	}
	.creator {
		color: var(--text-blurb);
		font-size: 0.8125rem;
	}

	.description {
		display: -webkit-box;
		overflow: hidden;
		font-size: 0.8125rem;
		white-space: pre-wrap;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow-wrap: break-word;

		&:empty {
			display: none;
		}
	}
</style>
