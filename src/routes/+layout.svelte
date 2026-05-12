<script lang="ts">
	import type { LayoutProps } from './$types';

	import FeedAside from './components/feed-aside.svelte';

	const { data, children }: LayoutProps = $props();
</script>

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
		/* max-width: 480px; */

		@media (width >= 640px) {
			/* grid-template-columns: minmax(255px, 320px) minmax(0, 600px); */
			/* grid-template-areas: 'aside main'; */
			/* grid-template-columns: minmax(0, 600px); */
			grid-template-areas: 'main';
			/* max-width: 960px; */
		}

		@media screen and (max-width: 1279px) {
			max-width: calc(100% - 32px);
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
</style>
