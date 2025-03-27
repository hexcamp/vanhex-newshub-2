<script lang="ts">
	import type { AppBskyFeedPost } from '@atcute/client/lexicons';
	import { cluster } from '@mary/array-fns';

	import { base } from '$app/paths';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import { findLabel, FlagsBlurMedia } from '$lib/moderation';
	import { parseAddressedAtUri } from '$lib/types/at-uri';
	import { truncateMiddle, truncateRight } from '$lib/utils/strings';

	import Avatar from '$lib/components/avatar.svelte';
	import BubblesOutlined from '$lib/components/central-icons/bubbles-outlined.svelte';
	import Embeds from '$lib/components/embeds/embeds.svelte';
	import Time from '$lib/components/islands/time.svelte';
	import OverflowMenu from '$lib/components/overflow-menu.svelte';
	import PageContainer from '$lib/components/page/page-container.svelte';
	import RichtextRenderer from '$lib/components/richtext-renderer.svelte';

	const { data }: PageProps = $props();

	const main = $derived(data.posts[0]);

	const author = $derived(main.author);
	const authorName = $derived(author.displayName?.trim());

	const uri = $derived(parseAddressedAtUri(main.uri));
	const postUrl = $derived(`${base}/${uri.repo}/${uri.rkey}#main`);
	const authorUrl = $derived(`${base}/${uri.repo}`);

	const isAviBlurred = $derived(!!findLabel(author.labels, author.did, FlagsBlurMedia));

	const title = $derived.by(() => {
		const author = `@${truncateMiddle(main.author.handle, 29)}`;
		const content = truncateRight((main.record as AppBskyFeedPost.Record).text.trim(), 70);

		return `${author}: "${content}" — ${PUBLIC_APP_NAME}`;
	});

	const clusters = $derived.by(() => {
		return cluster(data.posts, (_a, b, [first]) => {
			const bDate = new Date(b.indexedAt);
			const firstDate = new Date(first.indexedAt);

			const diff = bDate.getTime() - firstDate.getTime();
			return diff < 2.5 * 60 * 1_000;
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="canonical" href="https://bsky.app/profile/{uri.repo}/post/{uri.rkey}" />
	<link rel="alternate" href={main.uri} />
</svelte:head>

<PageContainer>
	<div class="unroll-page">
		<div class="profile">
			<Avatar profile={author} size="lg" tabindex={-1} href={authorUrl} blur={isAviBlurred} />

			<a href={authorUrl} class="name-wrapper">
				{#if authorName}
					<bdi class="display-name-wrapper">
						<span class="display-name">{authorName}</span>
					</bdi>
				{/if}

				<span class="handle">@{author.handle}</span>
			</a>

			<OverflowMenu
				class="thread-actions"
				items={[
					{
						label: `View original thread`,
						icon: BubblesOutlined,
						href: postUrl,
					},
				]}
			/>
		</div>

		<ol class="thread">
			{#each clusters as cluster, idx}
				{@const first = cluster[0]}
				{@const date = new Date(first.indexedAt)}

				<li class="item" role="article">
					<div class="aside">
						<div class="dot"></div>

						{#if idx !== clusters.length - 1}
							<div class="line"></div>
						{/if}
					</div>

					<div class="content">
						<p class="meta">
							<span class="date">
								<Time {date} format="long-date" />
							</span>
						</p>

						{#each cluster as post}
							{@const record = post.record as AppBskyFeedPost.Record}

							<div class="subitem">
								<RichtextRenderer text={record.text} facets={record.facets} />

								{#if post.embed}
									<Embeds embed={post.embed} />
								{/if}
							</div>
						{/each}
					</div>
				</li>
			{/each}
		</ol>
	</div>
</PageContainer>

<style>
	.unroll-page {
		background: var(--bg-primary);
	}

	.profile {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 16px 0;
		color: var(--text-blurb);

		:global(.thread-actions) {
			margin: 0 -4px;
		}
	}
	.name-wrapper {
		display: block;
		margin: 0 auto 0 0;
		max-width: 100%;
		overflow: hidden;
		color: inherit;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.display-name-wrapper {
		overflow: hidden;
		text-overflow: ellipsis;

		.name-wrapper:hover & {
			text-decoration: underline;
		}
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

	.thread {
		margin: 0;
		padding: 0 16px;
		list-style: none;
	}

	.item {
		display: flex;
		gap: 16px;
	}

	.aside {
		position: relative;

		.item:only-child & {
			display: none;
		}
	}
	.dot {
		margin: 30px 0 0 0;
		border-radius: 9999px;
		background: color-mix(in srgb, var(--divider-md), var(--text-blurb) 50%);
		width: 8px;
		height: 8px;
	}
	.line {
		position: absolute;
		top: 42px;
		bottom: -26px;
		left: calc(4px - 1px);
		border-left: 2px solid var(--divider-md);
	}

	.content {
		display: flex;
		flex-direction: column;
		padding: 24px 0;
		min-width: 0;
	}
	.meta {
		color: var(--text-blurb);
	}

	.subitem {
		margin: 0.25lh 0 0 0;

		& + & {
			margin: 1lh 0 0 0;
		}
	}
</style>
