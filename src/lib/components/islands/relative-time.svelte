<script lang="ts">
	import { dev } from '$app/environment';
	import { base } from '$app/paths';

	import { formatLongDate, formatRelativeTime } from '$lib/utils/intl/date';

	import Island from '../island.svelte';

	interface Props {
		date: string | number;
	}

	const { date: rawDate }: Props = $props();

	const date = $derived(new Date(rawDate));
</script>

{#if dev}
	<time class="isl-relative-time" title={formatLongDate(date.getTime())} datetime={date.toISOString()}>
		{formatRelativeTime(date.getTime())}
	</time>
{:else}
	<Island scriptUrl="{base}/_scripts/relative-time.js">
		<time class="isl-relative-time" title={formatLongDate(date.getTime())} datetime={date.toISOString()}>
			{formatRelativeTime(date.getTime())}
		</time>
	</Island>
{/if}
