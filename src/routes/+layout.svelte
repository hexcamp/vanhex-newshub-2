<script lang="ts">
	import type { LayoutProps } from './$types';

	import FeedAside from './components/feed-aside.svelte';

	const { data, children }: LayoutProps = $props();
</script>

<section class="grid-section">
	<div class="grid1">
		<div class="grid1-1">grid1-1</div>
		<div class="grid1-2">
			grid1-2
			<div class="subgrid1-2">
				<div class="subgrid1-2-1">subgrid1-2-1</div>
				<div class="subgrid1-2-2">subgrid1-2-2</div>
				<div class="subgrid1-2-3">subgrid1-2-3</div>
			</div>
		</div>
		<div class="grid1-3">
			grid1-3
			<div class="subgrid1-3">
				<div class="subgrid1-3-1">subgrid1-3-1</div>
				<div class="subgrid1-3-2">subgrid1-3-2</div>
				<div class="subgrid1-3-3">subgrid1-3-3</div>
				<div class="subgrid1-3-4">subgrid1-3-4</div>
			</div>
		</div>
	</div>
</section>

{#key data.feed.uri}
	<div class="custom-feed-layout">
		{#if false}
			<div class="aside">
				<FeedAside feed={data.feed} />
			</div>
		{/if}

		<div class="main">
			<div class="header">
				<h1>VanHex News Hub Experiment #2</h1>
				<a href="https://github.com/hexcamp/vanhex-newshub-2">Source on GitHub</a>
				- <a href="https://6kg6rqiaaaaa.vanhex.ca/">Other Experiments</a>
			</div>
			{@render children()}
		</div>
	</div>
{/key}

<style>
	.custom-feed-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		/* grid-template-areas: 'aside' 'main'; */
		grid-template-areas: 'main';
		justify-content: center;
		gap: 8px;
		/* margin: 24px auto 0; */
		max-width: 480px;

		@media (width >= 640px) {
			/* grid-template-columns: minmax(255px, 320px) minmax(0, 600px); */
			/* grid-template-areas: 'aside main'; */
			grid-template-columns: minmax(0, 600px);
			grid-template-areas: 'main';
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

	.header {
		/* padding-bottom: 24px; */
		padding: 10px;
	}

	.header h1 {
		margin-bottom: 0.5rem;
		line-height: normal;
	}

	.grid-section {
	}

	.grid1 {
		display: grid;
		grid-template-rows: min-content minmax(0px, 1fr);
		grid-template-columns: repeat(24, 1fr);
		grid-auto-flow: row;
		gap: 32px 16px;
		margin-inline: 16px;
		width: 100%;
		max-width: calc(1248px);
	}

	.grid1-1 {
		grid-column: 1 / span 18;
	}

	.grid1-2 {
		grid-area: 1 / 19 / span 2 / span 6;
	}

	.grid1-3 {
		grid-column: 1 / span 18;
	}

	.subgrid1-2 {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-auto-flow: row;
		gap: 16px;
		width: 100%;
		min-width: fit-content;
		max-width: calc(1248px);
	}

	.subgrid1-2-1 {
		grid-column: 1 / span 6;
	}

	.subgrid1-2-2 {
		grid-column: 1 / span 6;
	}

	.subgrid1-2-3 {
		grid-column: 1 / span 6;
	}

	.subgrid1-3 {
		display: grid;
		grid-template-columns: repeat(20, 1fr);
		grid-auto-flow: row;
		column-gap: 16px;
		width: 100%;
		min-width: fit-content;
		max-width: calc(1248px);
	}

	.subgrid1-3-1 {
		grid-column: 1 / span 5;
	}

	.subgrid1-3-2 {
		grid-column: 6 / span 5;
	}

	.subgrid1-3-3 {
		grid-column: 11 / span 5;
	}

	.subgrid1-3-4 {
		grid-column: 16 / span 5;
	}
</style>
