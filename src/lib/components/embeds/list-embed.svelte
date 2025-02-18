<script lang="ts" module>
	const getPurpose = (purpose: AppBskyGraphDefs.ListPurpose) => {
		switch (purpose) {
			case 'app.bsky.graph.defs#curatelist':
				return `User list`;
			case 'app.bsky.graph.defs#modlist':
				return `Moderation list`;
		}

		return `Unknown list`;
	};
</script>

<script lang="ts">
	import type { AppBskyGraphDefs } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { findLabel, FlagsBlurMedia } from '$lib/moderation';
	import { parseAtUri } from '$lib/types/at-uri';
	import { truncateRight } from '$lib/utils/strings';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		embed: AppBskyGraphDefs.ListView;
	}

	const { embed: list }: Props = $props();

	const creator = $derived(list.creator);

	const blurAvi = $derived(!!findLabel(list.labels, creator.did, FlagsBlurMedia));
</script>

<a href="{base}/{creator.did}/lists/{parseAtUri(list.uri).rkey}" class="list-embed">
	<div class="main">
		<Avatar type="list" src={list.avatar} blur={blurAvi} />

		<div class="info">
			<p class="name">{list.name}</p>
			<p class="creator">{getPurpose(list.purpose)} by @{creator.handle}</p>
		</div>
	</div>

	<p class="description">{truncateRight(list.description?.trim() ?? '', 190)}</p>
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
