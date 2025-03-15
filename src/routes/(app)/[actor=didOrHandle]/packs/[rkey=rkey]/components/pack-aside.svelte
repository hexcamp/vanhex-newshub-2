<script lang="ts">
	import type { AppBskyGraphDefs, AppBskyGraphStarterpack } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAddressedAtUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { trimRichText } from '$lib/utils/bluesky/richtext';

	import Avatar from '$lib/components/avatar.svelte';
	import SquareArrowTopRightOutlined from '$lib/components/central-icons/square-arrow-top-right-outlined.svelte';
	import OverflowMenu from '$lib/components/overflow-menu.svelte';
	import RichtextRawRenderer from '$lib/components/richtext-raw-renderer.svelte';
	import RichtextRenderer from '$lib/components/richtext-renderer.svelte';

	interface Props {
		pack: AppBskyGraphDefs.StarterPackView;
	}

	const { pack }: Props = $props();

	const uri = $derived(parseAddressedAtUri(pack.uri));
	const record = $derived(pack.record as AppBskyGraphStarterpack.Record);

	const creatorUrl = $derived(`${base}/${pack.creator.did}`);
</script>

<div class="pack-aside">
	<Avatar type="starterpack" size="xl" />

	<OverflowMenu
		class="pack-overflow"
		items={[
			{
				label: `Open in Bluesky app`,
				href: `https://bsky.app/starter-pack/${uri.repo}/${uri.rkey}`,
				external: true,
				icon: SquareArrowTopRightOutlined,
			},
			{
				label: `Open in PDSls`,
				href: `https://pdsls.dev/${pack.uri}`,
				external: true,
				icon: SquareArrowTopRightOutlined,
			},
		]}
	/>

	<p dir="auto" class="display-name">{normalizeDisplayName(record.name)}</p>

	{#if record.description}
		{#if record.descriptionFacets === undefined}
			<RichtextRawRenderer text={trimRichText(record.description)} />
		{:else}
			<RichtextRenderer text={record.description} facets={record.descriptionFacets} />
		{/if}
	{/if}

	<div class="creator">
		<Avatar profile={pack.creator} size="xs" href={creatorUrl} tabindex={-1} />
		<a href={creatorUrl} class="handle">{pack.creator.handle}</a>
	</div>
</div>

<style>
	.pack-aside {
		display: flex;
		position: relative;
		flex-direction: column;
		background: var(--bg-primary);
		padding: 16px;
		min-width: 0;

		:global(.pack-overflow) {
			position: absolute;
			top: 12px;
			right: 12px;
		}
	}

	.display-name {
		margin: 16px 0 4px 0;
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.75rem;
		overflow-wrap: break-word;
	}

	.creator {
		display: flex;
		gap: 8px;
		margin: 16px 0 0 0;
		min-width: 0;
		color: var(--text-blurb);
		font-weight: 500;
	}
	.handle {
		overflow: hidden;
		color: inherit;
		text-overflow: ellipsis;
		white-space: nowrap;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
