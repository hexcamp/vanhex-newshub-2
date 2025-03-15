<script lang="ts">
	import type { AppBskyFeedDefs, AppBskyFeedThreadgate } from '@atcute/client/lexicons';

	import type { UnwrapArray } from '$lib/utils/types';

	import EarthOutlined from '$lib/components/central-icons/earth-outlined.svelte';
	import Group_2Outlined from '$lib/components/central-icons/group-2-outlined.svelte';
	import CircleBanSignOutlined from '$lib/components/central-icons/circle-ban-sign-outlined.svelte';
	import { base } from '$app/paths';
	import { parseAddressedAtUri } from '$lib/types/at-uri';

	interface Props {
		threadgate: AppBskyFeedDefs.ThreadgateView | undefined;
	}

	type GateRecord = AppBskyFeedThreadgate.Record;
	type Allow = UnwrapArray<GateRecord['allow']>;

	const { threadgate }: Props = $props();

	const id = $props.id();

	const record = $derived(threadgate?.record as AppBskyFeedThreadgate.Record | undefined);

	const allow = $derived.by(() => {
		const order: Record<Allow['$type'], number> = {
			'app.bsky.feed.threadgate#followerRule': 0,
			'app.bsky.feed.threadgate#followingRule': 1,
			'app.bsky.feed.threadgate#mentionRule': 2,
			'app.bsky.feed.threadgate#listRule': 3,
		};

		return record?.allow?.toSorted((a, b) => {
			const result = (order[a.$type] ?? 99) - (order[b.$type] ?? 99);
			if (result !== 0) {
				return result;
			}

			if (
				a.$type === 'app.bsky.feed.threadgate#listRule' &&
				b.$type === 'app.bsky.feed.threadgate#listRule'
			) {
				if (a.list > b.list) {
					return 1;
				} else if (a.list < b.list) {
					return -1;
				}
			}

			return 0;
		});
	});

	const summary = $derived.by(() => {
		if (allow === undefined) {
			return {
				icon: EarthOutlined,
				label: `Everyone can reply`,
			};
		}
		if (allow.length === 0) {
			return {
				icon: CircleBanSignOutlined,
				label: `Replies disabled`,
			};
		}

		return {
			icon: Group_2Outlined,
			label: `Replies limited`,
		};
	});
</script>

<button class="button" popovertarget={id} style="anchor-name: --{id}">
	<summary.icon />
	<span>{summary.label}</span>
</button>

<dialog popover="auto" class="dialog" {id} style="position-anchor: --{id}">
	<h3 class="title">Who can reply?</h3>

	{#if allow === undefined}
		<p class="detail">Everyone can reply to this thread.</p>
	{:else if allow.length === 0}
		<p class="detail">Replies to this thread are disabled.</p>
	{:else}
		<p class="detail">Replies to this thread are limited to:</p>

		<ul class="rules">
			{#each allow as rule}
				{#if rule.$type === 'app.bsky.feed.threadgate#followerRule'}
					<li>Users following the thread author</li>
				{:else if rule.$type === 'app.bsky.feed.threadgate#followingRule'}
					<li>Users followed by the thread author</li>
				{:else if rule.$type === 'app.bsky.feed.threadgate#mentionRule'}
					<li>Users mentioned in the thread</li>
				{:else if rule.$type === 'app.bsky.feed.threadgate#listRule'}
					{@const hydrated = threadgate!.lists?.find((list) => list.uri === rule.list)}

					{#if hydrated}
						{@const uri = parseAddressedAtUri(rule.list)}

						<li>
							Users in <a class="link" href="{base}/{uri.repo}/lists/{uri.rkey}">{hydrated.name}</a> list
						</li>
					{:else}
						<li>Users in a deleted list</li>
					{/if}
				{:else}
					<li>Unknown rule</li>
				{/if}
			{/each}
		</ul>
	{/if}
</dialog>

<style>
	.button {
		display: flex;
		align-items: center;
		gap: 6px;
		appearance: none;
		cursor: pointer;
		border: 0;
		background: transparent;
		color: inherit;
		list-style: none;
		user-select: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.dialog {
		margin: 16px;
		box-shadow:
			0 20px 25px -5px rgb(0 0 0 / 0.25),
			0 8px 10px -6px rgb(0 0 0 / 0.25);
		border: 1px solid var(--divider-md);
		border-radius: 4px;
		background: var(--bg-primary);
		padding: 16px;
		width: max-content;
		max-width: min(384px, calc(100dvw - 16px * 2));
		max-height: 55dvh;
		color: var(--text-primary);

		@supports not (position-anchor: auto) {
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		@supports (position-anchor: auto) {
			top: calc(anchor(bottom) - 12px);
			bottom: unset;
			justify-self: anchor-center;
			position-try: flip-block;
		}
	}

	.title {
		margin: 0 0 8px 0;
		font-size: 1rem;
		line-height: 1.5rem;
	}

	.detail {
		color: var(--text-blurb);
	}

	.rules {
		margin: 8px 0 0 0;
		padding: 0 0 0 14px;
	}
	li + li {
		margin: 4px 0 0 0;
	}

	.link {
		&:hover {
			text-decoration: underline;
		}
	}
</style>
