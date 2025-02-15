<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	import { base } from '$app/paths';
	import { page } from '$app/state';
	import type { LayoutProps } from './$types';

	import MagnifyingGlassOutlined from '$lib/components/central-icons/magnifying-glass-outlined.svelte';
	import PageContainer from '$lib/components/page/page-container.svelte';

	const { children }: LayoutProps = $props();

	const query = $derived(encodeURIComponent(page.url.searchParams.get('q')?.trim() || ''));
	const currentRouteId = $derived(page.route.id);

	const cn = (routeId: string): ClassValue => {
		const id = `/(app)/search${routeId}`;
		return ['tab', currentRouteId === id && 'is-active'];
	};
</script>

<PageContainer>
	<div class="search-container">
		<form method="get" class="search-box">
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="search"
				name="q"
				required
				value={page.url.searchParams.get('q') ?? ''}
				placeholder="Search..."
				class="input"
			/>

			<button tabindex={-1} aria-label="Search" type="submit" class="button">
				<MagnifyingGlassOutlined />
			</button>
		</form>
	</div>

	<div class="main">
		<div class="search-tabs" data-sveltekit-keepfocus>
			<a class={cn('/posts')} href="{base}/search/posts?sort=top&q={query}">Posts</a>
			<a class={cn('/users')} href="{base}/search/users?q={query}">Users</a>
			<a class={cn('/feeds')} href="{base}/search/feeds?q={query}">Feeds</a>

			<div class="spacer"></div>
		</div>

		{#if currentRouteId === `/(app)/search/posts`}
			{@const sort = page.url.searchParams.get('sort') ?? 'top'}

			<div class="filter-bar">
				<a href="{base}/search/posts?sort=top&q={query}" class={['filter', sort === 'top' && 'is-active']}>
					Top
				</a>
				<a
					href="{base}/search/posts?sort=latest&q={query}"
					class={['filter', sort === 'latest' && 'is-active']}
				>
					Latest
				</a>
			</div>
		{/if}

		{@render children()}
	</div>
</PageContainer>

<style>
	.search-container {
		margin: 0 0 24px 0;
		background: var(--bg-primary);
		padding: 16px;
		width: 100%;
		max-width: 600px;
	}

	.search-box {
		display: flex;
		position: relative;
	}
	.input {
		flex-grow: 1;
		appearance: none;
		border: 1px solid var(--divider-md);
		background: transparent;
		padding: 10px 36px 10px 12px;
		color: inherit;

		&::placeholder {
			color: var(--text-blurb);
			font-style: italic;
		}

		&:focus {
			outline-offset: -1px;
		}
	}
	.button {
		display: grid;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		flex-shrink: 0;
		place-items: center;
		appearance: none;
		cursor: pointer;
		margin: 1px;
		border: 0;
		background: transparent;
		aspect-ratio: 1 / 1;
		color: color-mix(in srgb, var(--text-primary), transparent 10%);
		font-size: 1.125rem;

		&:hover {
			background: var(--tap-sm-pressed);
		}
	}

	.search-tabs {
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

	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		background: var(--bg-primary);
		padding: 16px;
	}

	.filter {
		display: flex;
		align-items: center;
		border: 1px solid var(--divider-md);
		border-radius: 4px;
		padding: 0 12px;
		min-width: 0;
		height: 32px;
		color: var(--text-primary);
		font-weight: 500;

		&:hover {
			background: var(--tap-sm);
		}

		&.is-active {
			border-color: transparent;
			background: color-mix(in srgb, var(--text-primary), transparent 85%);
		}
	}
</style>
