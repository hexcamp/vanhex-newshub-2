<script lang="ts">
	import type { AppBskyFeedDefs, AppBskyFeedThreadgate } from '@atcute/client/lexicons';

	import type { UnwrapArray } from '$lib/utils/types';

	import EarthOutlined from '$lib/components/central-icons/earth-outlined.svelte';
	import Group_2Outlined from '$lib/components/central-icons/group-2-outlined.svelte';
	import CircleBanSignOutlined from '$lib/components/central-icons/circle-ban-sign-outlined.svelte';
	import { base } from '$app/paths';
	import { parseAtUri } from '$lib/types/at-uri';

	interface Props {
		threadgate: AppBskyFeedDefs.ThreadgateView | undefined;
	}

	type GateRecord = AppBskyFeedThreadgate.Record;
	type Allow = UnwrapArray<GateRecord['allow']>;

	const { threadgate }: Props = $props();

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

<details class="interactions-state">
	<summary class="button">
		<summary.icon />
		<span>{summary.label}</span>
	</summary>

	<div class="container">
		<div class="popover">
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
								{@const uri = parseAtUri(rule.list)}

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
		</div>
	</div>
</details>

<style>
	.button {
		display: flex;
		align-items: center;
		gap: 6px;
		cursor: pointer;
		list-style: none;
		user-select: none;

		&:hover {
			text-decoration: underline;
		}
	}

	.container {
		position: relative;
		color: var(--text-primary);
	}

	.popover {
		position: absolute;
		top: 4px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1;
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 0.1),
			0 4px 6px -4px rgb(0 0 0 / 0.1);
		border: 1px solid var(--divider-md);
		border-radius: 4px;
		background: var(--bg-primary);
		padding: 16px;
		width: max-content;
		max-width: 384px;
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
		padding: 0 0 0 12px;
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
