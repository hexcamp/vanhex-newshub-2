<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import type { PageProps } from './$types';

	import Avatar from '$lib/components/avatar.svelte';
	import PageContainer from '$lib/components/page/page-container.svelte';

	import type { MappedTopic } from './utils';

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Trending — {PUBLIC_APP_NAME}</title>
</svelte:head>

{#snippet Topic(topic: MappedTopic)}
	<a href={topic.href} class="topic">
		{#if topic.type === 'starterpack'}
			<Avatar type="starterpack" size="xs" />
			<!-- {:else}
			<HashtagOutlined /> -->
		{/if}

		<span>{topic.name}</span>
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
		display: flex;
		align-items: center;
		gap: 8px;
		outline-offset: -1px;
		border: 1px solid var(--divider-sm);
		border-radius: 9999px;
		padding: 4px 12px;
		color: color-mix(in srgb, var(--text-primary), transparent 10%);
		font-weight: 500;

		:global(.avatar) {
			margin-left: -4px;
		}

		:global(.sv-icon) {
			margin-left: -2px;
			font-size: 1rem;
		}

		@media (hover: hover) {
			&:hover {
				background: var(--tap-sm-pressed);
			}
		}
	}
</style>
