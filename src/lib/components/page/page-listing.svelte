<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		subject: 'timeline' | 'posts' | 'profiles' | 'reposts' | 'likes' | 'feeds' | 'lists' | 'packs';
		rootUrl?: string;
		nextUrl?: string;
		children: Snippet<[]>;
	}

	const { subject, rootUrl, nextUrl, children }: Props = $props();
</script>

<div class="page-listing">
	{#if rootUrl}
		<a href={rootUrl} class="button latest-button">Show latest {subject}</a>
	{/if}

	{@render children()}

	{#if nextUrl}
		<a href={nextUrl} class="button more-button">
			{subject === 'timeline' ? `Show older posts` : `Show more ${subject}`}
		</a>
	{:else}
		<div class="end-marker">
			{subject === 'timeline' ? `No more posts.` : `No more ${subject}.`}
		</div>
	{/if}
</div>

<style>
	.page-listing {
		background: var(--bg-primary);
	}

	.button {
		display: grid;
		place-items: center;
		height: 53px;
		font-weight: 500;

		&:hover {
			background: var(--tap-sm);
		}
	}
	.latest-button {
		border-bottom: 1px solid var(--divider-sm);
	}

	.end-marker {
		display: grid;
		place-items: center;
		height: 53px;
		color: var(--text-blurb);
		font-style: italic;
		font-weight: 500;
	}
</style>
