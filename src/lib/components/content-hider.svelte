<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { LabelDefinition } from '$lib/moderation';

	interface Props {
		blur: LabelDefinition | undefined;
		children: Snippet<[]>;
	}

	const { blur, children }: Props = $props();
</script>

{#if !blur}
	{@render children()}
{:else}
	<details class="content-hider">
		<summary class="gate">
			<svg class="icon" fill="none" viewBox="0 0 24 24">
				<path
					stroke="currentColor"
					stroke-linecap="square"
					stroke-width="2"
					d="M11 11h1v5m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
				<path
					fill="currentColor"
					stroke="currentColor"
					stroke-width=".5"
					d="M11.5 7.25h-.25v1.5h1.5v-1.5H11.5Z"
				/>
			</svg>

			<span class="label">{blur.name}</span>

			<span class="action"></span>
		</summary>

		<div class="contents">
			{@render children()}
		</div>
	</details>
{/if}

<style>
	.gate {
		display: flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;
		border: 1px solid var(--divider-md);
		border-radius: 6px;
		padding: 0 12px;
		height: 44px;

		.content-hider[open] & {
			margin-bottom: 12px;
		}

		@media (hover: hover) {
			&:hover {
				background: var(--tap-sm);
			}
		}
	}

	.icon {
		width: 18px;
		height: 18px;
		color: var(--text-blurb);
	}
	.label {
		flex-grow: 1;
		overflow: hidden;
		font-weight: 500;
		user-select: none;
		text-overflow: ellipsis;
	}

	.action {
		color: var(--text-link);
		font-weight: 500;
		font-size: 0.8125rem;
		line-height: 1.25rem;

		&::before {
			content: 'Show';
		}
		.content-hider[open] &::before {
			content: 'Hide';
		}
	}

	.contents {
		display: flex;
		flex-direction: column;
	}
</style>
