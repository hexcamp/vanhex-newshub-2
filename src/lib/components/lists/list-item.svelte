<script lang="ts">
	import type { AppBskyGraphDefs } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAddressedAtUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { purposeToLabel } from '$lib/utils/bluesky/lists';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { truncateMiddle } from '$lib/utils/strings';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		item: AppBskyGraphDefs.ListView;
	}

	const { item: list }: Props = $props();

	const creator = $derived(list.creator);

	const href = $derived(`${base}/${creator.did}/lists/${parseAddressedAtUri(list.uri).rkey}`);
</script>

<div class="list-item">
	<div class="main">
		<Avatar type="list" src={list.avatar} {href} tabindex={-1} />

		<a {href} class="info">
			<p class="name">{normalizeDisplayName(list.name)}</p>
			<p class="creator">{purposeToLabel(list.purpose)} by @{truncateMiddle(creator.handle, 29)}</p>
		</a>
	</div>

	<p class="description">{trimRichText(list.description ?? '')}</p>
</div>

<style>
	.list-item {
		display: flex;
		flex-direction: column;
		gap: 12px;
		border-bottom: 1px solid var(--divider-md);
		padding: 12px 16px;
		color: var(--text-primary);
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
		color: inherit;
		overflow-wrap: break-word;
	}
	.name {
		font-weight: 700;

		.info &:hover {
			text-decoration: underline;
		}
	}
	.creator {
		color: var(--text-blurb);
		font-size: 0.8125rem;
		line-height: 1.25rem;
	}

	.description {
		display: -webkit-box;
		overflow: hidden;
		font-size: 0.8125rem;
		line-height: 1.25rem;
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
