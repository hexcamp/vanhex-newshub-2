<script lang="ts">
	import { dev } from '$app/environment';
	import { base } from '$app/paths';

	import { formatLongDate } from '$lib/utils/intl/date';

	import Island from '../island.svelte';

	interface Props {
		date: string | number;
	}

	const { date: rawDate }: Props = $props();

	const date = $derived(new Date(rawDate));
</script>

{#if dev}
	<time class="isl-long-date" datetime={date.toISOString()}>
		{formatLongDate(date.getTime())}
	</time>
{:else}
	<Island scriptUrl="{base}/_scripts/time-formatter.js" fetchPriority="low">
		<time class="isl-long-date" datetime={date.toISOString()}>
			{formatLongDate(date.getTime())}
		</time>
	</Island>
{/if}
