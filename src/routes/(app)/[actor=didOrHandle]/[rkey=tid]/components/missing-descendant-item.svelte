<script lang="ts">
	interface Props {
		count: number;
	}

	const { count }: Props = $props();
</script>

<div class="missing-descendant-item">
	<span class="label">{count === 1 ? `${count} missing reply` : `${count} missing replies`}</span>
</div>

<style>
	.missing-descendant-item {
		padding: 12px;
		color: var(--text-blurb);
		font-style: italic;
	}
</style>
