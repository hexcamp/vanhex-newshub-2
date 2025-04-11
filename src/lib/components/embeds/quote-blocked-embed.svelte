<script lang="ts">
	import type { AppBskyEmbedRecord, Brand } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import type { AddressedAtUri } from '$lib/types/at-uri';

	import CircleBanSignOutlined from '$lib/components/central-icons/circle-ban-sign-outlined.svelte';

	interface Props {
		embed: Brand.Union<AppBskyEmbedRecord.ViewBlocked | AppBskyEmbedRecord.ViewDetached>;
		uri: AddressedAtUri;
	}

	const { embed, uri }: Props = $props();
</script>

<a href="{base}/{uri.repo}/{uri.rkey}#main" class="gate">
	<CircleBanSignOutlined />

	<span class="label">
		{embed.$type === 'app.bsky.embed.record#viewDetached' ? `Quote detached` : `Interaction blocked`}
	</span>

	<span class="action">View</span>
</a>

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
		color: var(--text-primary);

		@media (hover: hover) {
			&:hover {
				background: var(--tap-sm);
			}
		}

		:global(.sv-icon) {
			width: 18px;
			height: 18px;
			color: var(--text-blurb);
		}
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
	}
</style>
