<script lang="ts">
	import DotGrid_1x3HorizontalOutlined from '$lib/components/central-icons/dot-grid-1x3-horizontal-outlined.svelte';

	interface Props {
		postUrl: string;
	}

	const { postUrl }: Props = $props();
</script>

<div class="overflow-ascendant-item">
	<div class="circle">
		<DotGrid_1x3HorizontalOutlined />
	</div>

	<div class="descendant-line"></div>

	<a href={postUrl} class="link">See parent replies</a>
</div>

<style>
	.overflow-ascendant-item {
		display: flex;
		position: relative;
		gap: 12px;
		padding: 16px;
		user-select: none;
	}

	.circle {
		display: grid;
		place-items: center;
		margin: 0 8px;
		border-radius: 9999px;
		background: var(--divider-md);
		width: 20px;
		height: 20px;
		color: var(--text-primary);
		font-size: 12px;
	}

	.descendant-line {
		position: absolute;
		top: calc(16px + 20px + 4px);
		bottom: 0;
		left: calc(16px + 8px + (20px / 2) - 1px);
		border-left: 2px solid var(--divider-md);
	}

	.link {
		&:hover {
			text-decoration: underline;
		}
	}
</style>
