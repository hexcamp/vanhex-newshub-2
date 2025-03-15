<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	import type { AppBskyGraphStarterpack } from '@atcute/client/lexicons';

	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { LayoutProps } from './$types';

	import { parseAddressedAtUri } from '$lib/types/at-uri';

	import PackAside from './components/pack-aside.svelte';
	import PackMetaTags from './components/pack-meta-tags.svelte';

	const { data, children }: LayoutProps = $props();

	const currentRouteId = $derived(page.route.id);

	const record = $derived(data.pack.record as AppBskyGraphStarterpack.Record);
	const uri = $derived(parseAddressedAtUri(data.pack.uri));

	const listUrl = $derived.by(() => {
		return `${base}/${uri.repo}/packs/${uri.rkey}`;
	});

	const cn = (routeId: string): ClassValue => {
		const id = `/(app)/[actor=didOrHandle]/packs/[rkey=rkey]${routeId}`;
		return ['tab', currentRouteId === id && 'is-active'];
	};
</script>

<svelte:head>
	<title>{record.name.trim()} by @{data.pack.creator.handle} — {PUBLIC_APP_NAME}</title>
	<link rel="canonical" href="https://bsky.app/starter-pack/{uri.repo}/{uri.rkey}" />
	<link rel="alternate" href={data.pack.uri} />
</svelte:head>

<PackMetaTags pack={data.pack} />

{#key data.pack.uri}
	<div class="pack-layout">
		<div class="aside">
			<PackAside pack={data.pack} />
		</div>

		<div class="main">
			<div class="pack-tabs" data-sveltekit-keepfocus>
				<a class={cn('')} href={listUrl}>Users</a>

				{#if (data.pack.feeds?.length ?? 0) > 0}
					<a class={cn('/feeds')} href="{listUrl}/feeds">Feeds</a>
				{/if}

				<a class={cn('/posts')} href="{listUrl}/posts">Posts</a>

				<div class="spacer"></div>
			</div>

			{@render children()}
		</div>
	</div>
{/key}

<style>
	.pack-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas: 'aside' 'main';
		justify-content: center;
		gap: 8px;
		margin: 24px auto 0;
		max-width: 480px;

		@media (width >= 640px) {
			grid-template-columns: minmax(255px, 320px) minmax(0, 600px);
			grid-template-areas: 'aside main';
			max-width: 960px;
		}
	}

	.aside {
		display: flex;
		grid-area: aside;
		flex-direction: column;
		gap: 8px;

		@media (width >= 640px) {
			position: sticky;
			top: 0;
			max-height: 100dvh;
			overflow-y: auto;
		}
	}

	.main {
		grid-area: main;
		padding-bottom: 24px;
	}

	.pack-tabs {
		display: flex;
		position: sticky;
		top: 0;
		flex-wrap: wrap;
		z-index: 1;
		border-bottom: 1px solid var(--divider-sm);
		background: var(--bg-primary);
	}
	.tab {
		padding: 12px 16px;
		font-weight: 600;
		font-size: 1rem;
		line-height: 1.5rem;

		&:hover {
			text-decoration: underline;
		}

		&.is-active {
			color: var(--text-primary);
		}
	}
</style>
