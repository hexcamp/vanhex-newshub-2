<script lang="ts" module>
	import { getContext, setContext, type Snippet } from 'svelte';

	const key = Symbol('island');

	interface IslandContext {
		injected: Set<string>;
	}

	export const provideIsland = () => {
		const context: IslandContext = {
			injected: new Set(),
		};

		setContext(key, context);
	};

	export const injectIsland = (): IslandContext => {
		const context = getContext<IslandContext | undefined>(key);

		if (!context) {
			throw new Error('Island context not provided');
		}

		return context;
	};
</script>

<!-- svelte-ignore non_reactive_update -->
<script lang="ts">
	interface Props {
		scriptUrl: string;
		children: Snippet;
	}

	const { scriptUrl, children }: Props = $props();

	const context = injectIsland();

	let first = false;
	if (!context.injected.has(scriptUrl)) {
		context.injected.add(scriptUrl);
		first = true;
	}
</script>

<svelte:head>
	{#if first}
		<script type="module" src={scriptUrl}></script>
	{/if}
</svelte:head>

{@render children()}
