<script lang="ts">
	import { base } from '$app/paths';
	import type { PageProps } from './$types';

	import ArrowRightOutlined from '$lib/components/central-icons/arrow-right-outlined.svelte';
	import CompassRoundOutlined from '$lib/components/central-icons/compass-round-outlined.svelte';
	import MagnifyingGlassOutlined from '$lib/components/central-icons/magnifying-glass-outlined.svelte';
	import Trending_2Outlined from '$lib/components/central-icons/trending-2-outlined.svelte';

	const { form }: PageProps = $props();
</script>

<div class="wrapper">
	<div class="container">
		<form method="post" action="?/search" class="search-box">
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="search"
				name="query"
				required
				autofocus={!form || form.place === 'search'}
				placeholder="Search for keywords, @usernames, #tags"
				class="input"
				aria-invalid={form?.place === 'search'}
				aria-errormessage={form?.place === 'search' ? 'search-error' : undefined}
			/>

			<button tabindex={-1} aria-label="Search" type="submit" class="button">
				<MagnifyingGlassOutlined />
			</button>
		</form>

		{#if form?.place === 'search'}
			<p id="search-error" class="error-text">{form.error}</p>
		{/if}
	</div>

	<div class="container">
		<form method="post" action="?/redirect" class="search-box">
			<!-- svelte-ignore a11y_autofocus -->
			<input
				name="query"
				autofocus={form?.place === 'redirect'}
				placeholder="Enter bsky.app URL or AT-URI"
				class="input"
				aria-invalid={form?.place === 'redirect'}
				aria-errormessage={form?.place === 'redirect' ? 'redirect-error' : undefined}
			/>

			<button tabindex={-1} aria-label="Go" type="submit" class="button">
				<ArrowRightOutlined />
			</button>
		</form>

		{#if form?.place === 'redirect'}
			<p id="redirect-error" class="error-text">{form.error}</p>
		{/if}
	</div>

	<div class="links">
		<a href="{base}/trending" class="link">
			<Trending_2Outlined />
			<span>Trending</span>
		</a>

		<a href="{base}/did:plc:z72i7hdynmk6r22z27h6tvur/feeds/whats-hot" class="link">
			<CompassRoundOutlined />
			<span>Discover</span>
		</a>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 24px;
		min-height: 100dvh;
	}

	.container {
		margin: 0 auto;
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

	.error-text {
		display: block;
		margin: 8px 0 0 0;
		color: #dc2626;
		font-size: 0.8125rem;

		@media (prefers-color-scheme: dark) {
			color: #f87171;
		}
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 12px;
		padding: 0 16px;
	}

	.link {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		color: color-mix(in srgb, var(--text-primary), transparent 10%);

		:global(.sv-icon) {
			font-size: 16px;
		}

		&:hover {
			background: var(--tap-sm-pressed);
			color: var(--text-primary);
		}
	}
</style>
