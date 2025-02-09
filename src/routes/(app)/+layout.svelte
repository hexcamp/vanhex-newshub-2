<script lang="ts">
	import type { Snippet } from 'svelte';

	import { provideIsland } from '$lib/components/island.svelte';

	import '$lib/styles/app.css';

	interface Props {
		children: Snippet<[]>;
	}

	const { children }: Props = $props();

	provideIsland();
</script>

{@render children()}
