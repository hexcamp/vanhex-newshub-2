<script lang="ts">
	import DotGrid_1x3HorizontalOutlined from '$lib/components/central-icons/dot-grid-1x3-horizontal-outlined.svelte';

	interface Props {
		postUrl: string;
	}

	const { postUrl }: Props = $props();
</script>

<div class="overflow-descendant-item">
	<div class="circle">
		<DotGrid_1x3HorizontalOutlined />
	</div>

	<a href={postUrl} class="link">Continue thread</a>
</div>

<style>
	.overflow-descendant-item {
		display: flex;
		gap: 12px;
		padding: 12px;
		user-select: none;
	}

	.circle {
		display: grid;
		place-items: center;
		border-radius: 9999px;
		background: var(--divider-md);
		width: 20px;
		height: 20px;
		color: var(--text-primary);
		font-size: 12px;
	}

	.link {
		&:hover {
			text-decoration: underline;
		}
	}
</style>
