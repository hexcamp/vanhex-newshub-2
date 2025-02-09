<script lang="ts">
	import { LineType } from '$lib/models/thread';

	interface Props {
		lines: LineType[] | undefined;
	}

	const { lines = [] }: Props = $props();
</script>

<div class="tree-lines">
	{#each lines as line}
		<div class="line">
			{#if line === LineType.UP_RIGHT || line === LineType.VERTICAL_RIGHT}
				<div class="line-draw-right"></div>
			{/if}
			{#if line === LineType.VERTICAL || line === LineType.VERTICAL_RIGHT}
				<div class="line-draw-vertical"></div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.tree-lines {
		display: contents;
	}

	.line {
		position: relative;
		flex-shrink: 0;
		width: 20px;
	}
	.line-draw-right {
		position: absolute;
		top: 0;
		right: 2px;
		border-bottom: 2px solid var(--divider-md);
		border-left: 2px solid var(--divider-md);
		border-bottom-left-radius: 9px;
		width: 9px;
		height: 22px;
	}
	.line-draw-vertical {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 9px;
		border-left: 2px solid var(--divider-md);
	}
</style>
