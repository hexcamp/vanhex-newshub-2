<script lang="ts">
	import type { Component } from 'svelte';

	import DotGrid_1x3HorizontalOutlined from '$lib/components/central-icons/dot-grid-1x3-horizontal-outlined.svelte';

	interface Item {
		id?: string;
		label: string;
		href: string;
		external?: boolean;
		icon: Component;
	}

	interface Props {
		items: Item[];
		class?: string;
	}

	const { items, class: className }: Props = $props();

	const id = $props.id();
</script>

<button class={['button', className]} title="More actions" popovertarget={id} style="anchor-name: --{id}">
	<DotGrid_1x3HorizontalOutlined />
</button>

<dialog class="menu" {id} popover="auto" style="position-anchor: --{id}">
	{#each items as { id, label, href, external, icon: Icon }}
		<a class="item" {id} {href} rel={external ? 'noopener nofollow' : undefined}>
			<Icon />
			<span>{label}</span>
		</a>
	{/each}
</dialog>

<style>
	.button {
		display: grid;
		place-items: center;
		appearance: none;
		cursor: pointer;
		border: none;
		border-radius: 9999px;
		background: transparent;
		width: 32px;
		height: 32px;
		color: var(--text-blurb);
		font-size: 16px;

		&:hover {
			background: var(--tap-md);
			color: var(--text-primary);
		}
	}

	.menu {
		margin: 16px;
		box-shadow:
			0 20px 25px -5px rgb(0 0 0 / 0.25),
			0 8px 10px -6px rgb(0 0 0 / 0.25);
		border: 1px solid var(--divider-md);
		border-radius: 4px;
		background: var(--bg-primary);
		width: max-content;
		max-width: min(384px, calc(100dvw - 16px * 2));
		max-height: 55dvh;
		color: var(--text-primary);

		@supports not (position-anchor: auto) {
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		@supports (position-anchor: auto) {
			position-try: flip-block;
			top: calc(anchor(bottom) - 12px);
			bottom: unset;
			justify-self: anchor-center;
		}
	}

	.item {
		display: flex;
		gap: 12px;
		outline-offset: -2px;
		padding: 12px 16px;
		color: var(--text-primary);
		font-weight: 600;

		& > :global(.sv-icon) {
			margin: 1px 0 0 0;
			font-size: 18px;
		}

		&:first-child {
			border-radius: 4px 4px 0 0;
		}
		&:last-child {
			border-radius: 0 0 4px 4px;
		}

		&:hover {
			background: var(--tap-sm);
		}
	}
</style>
