<script lang="ts">
	interface Props {
		title: string;
	}

	const { title }: Props = $props();
</script>

<div class="page-header">
	<h2 class="title">{title}</h2>
</div>

<style>
	.page-header {
		position: sticky;
		top: 0;
		border-bottom: 1px solid var(--divider-sm);
		background: var(--bg-primary);
		padding: 12px 16px;
		z-index: 1;
	}

	.title {
		font-weight: 600;
		font-size: 1rem;
		line-height: 1.5rem;
	}
</style>
