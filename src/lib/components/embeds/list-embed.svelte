<script lang="ts">
	import type { AppBskyGraphDefs } from '@atcute/bluesky';

	import { base } from '$app/paths';

	import { findLabel, FlagsBlurMedia } from '$lib/moderation';
	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { purposeToLabel } from '$lib/utils/bluesky/lists';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { truncateRight } from '$lib/utils/strings';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		embed: AppBskyGraphDefs.ListView;
	}

	const { embed: list }: Props = $props();

	const creator = $derived(list.creator);

	const blurAvi = $derived(!!findLabel(list.labels, creator.did, FlagsBlurMedia));
</script>

<a href="{base}/{creator.did}/lists/{assertCanonicalResourceUri(list.uri).rkey}" class="list-embed">
	<div class="main">
		<Avatar type="list" src={list.avatar} blur={blurAvi} />

		<div class="info">
			<p class="name">{normalizeDisplayName(list.name)}</p>
			<p class="creator">{purposeToLabel(list.purpose)} by @{creator.handle}</p>
		</div>
	</div>

	<p class="description">{truncateRight(trimRichText(list.description ?? ''), 190)}</p>
</a>

<style>
	.list-embed {
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
