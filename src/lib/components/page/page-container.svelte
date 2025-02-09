<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet<[]>;
	}

	const { children }: Props = $props();
</script>

<div class="page-container">
	{@render children()}
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		margin: 24px auto;
		width: 100%;
		max-width: 600px;
	}
</style>
