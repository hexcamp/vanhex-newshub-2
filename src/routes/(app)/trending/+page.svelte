<script lang="ts">
	import PageContainer from '$lib/components/page/page-container.svelte';

	import type { PageProps } from './$types';
	import type { MappedTopic } from './utils';

	const { data }: PageProps = $props();
</script>

{#snippet Topic(topic: MappedTopic)}
	<a href={topic.href} class="topic">
		{topic.name}
	</a>
{/snippet}

<PageContainer>
	<main class="trending-page">
		<section class="section">
			<h2 class="heading">Trending</h2>

			<div class="topic-list">
				{#each data.topics as topic (topic.href)}
					{@render Topic(topic)}
				{/each}
			</div>
		</section>

		<section class="section">
			<h2 class="heading">Recommended</h2>

			<div class="topic-list">
				{#each data.suggested as topic (topic.href)}
					{@render Topic(topic)}
				{/each}
			</div>
		</section>
	</main>
</PageContainer>

<style>
	.trending-page {
		display: flex;
		flex-direction: column;
		gap: 32px;
		background: var(--bg-primary);
		padding: 16px;
	}

	.heading {
		font-weight: 600;
		font-size: 1rem;
		line-height: 1.5rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.topic-list {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 8px;
	}

	.topic {
		border: 1px solid var(--divider-sm);
		border-radius: 9999px;
		padding: 4px 12px;
		color: color-mix(in srgb, var(--text-primary), transparent 10%);
		font-weight: 500;

		@media (hover: hover) {
			&:hover {
				background: var(--tap-sm-pressed);
			}
		}
	}
</style>
