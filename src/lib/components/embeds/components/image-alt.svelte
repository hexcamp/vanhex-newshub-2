<script lang="ts">
	interface Props {
		alt: string;
	}

	const { alt }: Props = $props();

	const id = $props.id();
</script>

<button
	type="button"
	aria-label="Show image description"
	popovertarget={id}
	class="button"
	style="anchor-name: --{id}">ALT</button
>

<dialog popover="auto" class="dialog" {id} style="position-anchor: --{id}">
	<h3 class="title">Image description</h3>

	<p class="text">{alt}</p>
</dialog>

<style>
	.button {
		display: flex;
		position: absolute;
		right: 0;
		bottom: 0;
		align-items: center;
		appearance: none;
		opacity: 0.6;
		cursor: pointer;
		margin: 8px;
		border: 0;
		border-radius: 4px;
		background: rgb(10 10 10);
		padding: 0 4px;
		height: 18px;
		color: #ffffff;
		font-weight: 700;
		font-size: 9px;
		letter-spacing: 0.05em;

		&:hover {
			opacity: 1;
			background: rgb(30 30 30);
		}
	}

	.dialog {
		margin: 16px;
		box-shadow:
			0 20px 25px -5px rgb(0 0 0 / 0.25),
			0 8px 10px -6px rgb(0 0 0 / 0.25);
		border: 1px solid var(--divider-md);
		border-radius: 4px;
		background: var(--bg-primary);
		padding: 16px;
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

	.title {
		margin: 0 0 8px 0;
		font-size: 1rem;
		line-height: 1.5rem;
	}

	.text {
		white-space: pre-wrap;
		overflow-wrap: break-word;
	}
</style>
