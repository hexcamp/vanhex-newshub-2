<script lang="ts">
	import type { Snippet } from 'svelte';

	import '$lib/styles/app.css';

	interface Props {
		children: Snippet<[]>;
	}

	const { children }: Props = $props();
</script>

{@render children()}
