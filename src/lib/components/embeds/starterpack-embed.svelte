<script lang="ts">
	import type { AppBskyGraphDefs, AppBskyGraphStarterpack } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { parseAtUri } from '$lib/types/at-uri';

	interface Props {
		embed: AppBskyGraphDefs.StarterPackViewBasic;
		large?: boolean;
	}

	const { embed: pack, large = false }: Props = $props();

	const record = pack.record as AppBskyGraphStarterpack.Record;

	const creator = $derived(pack.creator);

	const rkey = $derived(parseAtUri(pack.uri).rkey);
</script>

<a href="{base}/{creator.did}/packs/{rkey}" class="starterpack-embed">
	{#if large}
		<img
			loading="lazy"
			src="https://ogcard.cdn.bsky.app/start/${creator.did}/${rkey}"
			alt=""
			class="banner"
		/>
	{/if}

	<div class="meta">
		<div class="main">
			<svg fill="none" viewBox="0 0 24 24" class="avatar">
				<defs>
					<linearGradient id="a" x1="0" x2="100%" y1="0" y2="0" gradientTransform="rotate(45)">
						<stop offset="0" stop-color="#0A7AFF" />
						<stop offset="1" stop-color="#59B9FF" />
					</linearGradient>
				</defs>
				<path
					fill="url(#a)"
					fill-rule="evenodd"
					d="M11.26 5.227 5.02 6.899c-.734.197-1.17.95-.973 1.685l1.672 6.24c.197.734.951 1.17 1.685.973l6.24-1.672a1.376 1.376 0 0 0 .973-1.685L12.945 6.2a1.375 1.375 0 0 0-1.685-.973Zm-6.566.459a2.632 2.632 0 0 0-1.86 3.223l1.672 6.24a2.632 2.632 0 0 0 3.223 1.861l6.24-1.672a2.631 2.631 0 0 0 1.861-3.223l-1.672-6.24a2.632 2.632 0 0 0-3.223-1.861l-6.24 1.672Z"
					clip-rule="evenodd"
				/>
				<path
					fill="url(#a)"
					fill-rule="evenodd"
					d="M15.138 18.411a4.606 4.606 0 1 0 0-9.211 4.606 4.606 0 0 0 0 9.211Zm0 1.257a5.862 5.862 0 1 0 0-11.724 5.862 5.862 0 0 0 0 11.724Z"
					clip-rule="evenodd"
				/>
			</svg>

			<div class="info">
				<p class="name">{record.name}</p>
				<p class="creator">Starter pack by @{creator.handle}</p>
			</div>
		</div>

		<p class="description">{record.description}</p>
	</div>
</a>

<style>
	.starterpack-embed {
		display: block;
		border: 1px solid var(--divider-md);
		border-radius: 6px;
		overflow: hidden;
		color: var(--text-primary);

		&:hover {
			background: var(--tap-sm);
		}
	}

	.banner {
		display: block;
		aspect-ratio: 1.91;
		width: 100%;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 12px;
	}

	.main {
		display: flex;
		gap: 12px;
	}

	.avatar {
		margin: 2px;
		width: 36px;
		height: 36px;
	}

	.name {
		font-weight: 700;
	}

	.creator {
		color: var(--text-blurb);
		font-size: 0.8125rem;
	}

	.description {
		display: -webkit-box;
		overflow: hidden;
		font-size: 0.8125rem;
		white-space: pre-wrap;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow-wrap: break-word;

		&:empty {
			display: none;
		}
	}
</style>
