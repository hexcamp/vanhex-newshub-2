<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	import { base } from '$app/paths';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';

	import ListAside from './components/list-aside.svelte';
	import ListMetaTags from './components/list-meta-tags.svelte';

	const { data, children }: LayoutProps = $props();

	const currentRouteId = $derived(page.route.id);

	const uri = $derived(assertCanonicalResourceUri(data.list.uri));
	const listUrl = $derived.by(() => {
		return `${base}/${uri.repo}/lists/${uri.rkey}`;
	});

	const cn = (routeId: string): ClassValue => {
		const id = `/(app)/[actor=didOrHandle]/lists/[rkey=rkey]${routeId}`;
		return ['tab', currentRouteId === id && 'is-active'];
	};
</script>

<svelte:head>
	<link rel="canonical" href="{base}/{uri.repo}/lists/{uri.rkey}" />
	<link rel="alternate" href={data.list.uri} />
</svelte:head>

<ListMetaTags list={data.list} />

{#key data.list.uri}
	<div class="list-layout">
		<div class="aside">
			<ListAside list={data.list} />
		</div>

		<div class="main">
			<div class="list-tabs" data-sveltekit-keepfocus>
				{#if data.list.purpose === 'app.bsky.graph.defs#curatelist'}
					<a class={cn('/posts')} href="{listUrl}/posts">Posts</a>
				{/if}

				<a class={cn('/members')} href="{listUrl}/members">Members</a>

				<div class="spacer"></div>
			</div>

			{@render children()}
		</div>
	</div>
{/key}

<style>
	.list-layout {
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

	.list-tabs {
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
