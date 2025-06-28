<script lang="ts">
	import type { AppBskyGraphDefs } from '@atcute/bluesky';

	import { base } from '$app/paths';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { formatLongNumber } from '$lib/utils/intl/number';

	import Avatar from '$lib/components/avatar.svelte';
	import SquareArrowTopRightOutlined from '$lib/components/central-icons/square-arrow-top-right-outlined.svelte';
	import OverflowMenu from '$lib/components/overflow-menu.svelte';
	import RichtextRawRenderer from '$lib/components/richtext-raw-renderer.svelte';
	import RichtextRenderer from '$lib/components/richtext-renderer.svelte';

	interface Props {
		list: AppBskyGraphDefs.ListView;
	}

	const { list }: Props = $props();

	const uri = $derived(assertCanonicalResourceUri(list.uri));

	const creatorUrl = $derived(`${base}/${list.creator.did}`);
</script>

<div class="list-aside">
	<Avatar type="list" src={list.avatar} size="xl" />

	<OverflowMenu
		class="list-overflow"
		items={[
			{
				label: `Open in Bluesky app`,
				href: `https://bsky.app/profile/${list.creator.did}/lists/${uri.rkey}`,
				external: true,
				icon: SquareArrowTopRightOutlined,
			},
			{
				label: `Open in PDSls`,
				href: `https://pdsls.dev/${list.uri}`,
				external: true,
				icon: SquareArrowTopRightOutlined,
			},
		]}
	/>

	<p dir="auto" class="display-name">{normalizeDisplayName(list.name)}</p>

	{#if list.description}
		{#if list.descriptionFacets === undefined}
			<RichtextRawRenderer text={trimRichText(list.description)} />
		{:else}
			<RichtextRenderer text={list.description} facets={list.descriptionFacets} />
		{/if}
	{/if}

	<p class="metric">
		{list.listItemCount === 1
			? `${formatLongNumber(list.listItemCount)} member`
			: `${formatLongNumber(list.listItemCount ?? 0)} members`}
	</p>

	<div class="creator">
		<Avatar profile={list.creator} size="xs" href={creatorUrl} tabindex={-1} />
		<a href={creatorUrl} class="handle">{list.creator.handle}</a>
	</div>
</div>

<style>
	.list-aside {
		display: flex;
		position: relative;
		flex-direction: column;
		background: var(--bg-primary);
		padding: 16px;
		min-width: 0;

		:global(.list-overflow) {
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

	.metric {
		margin: 12px 0 0 0;
		color: var(--text-blurb);
		font-size: 0.8125rem;
		line-height: 1.25rem;

		.display-name + & {
			margin: 0;
		}
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
