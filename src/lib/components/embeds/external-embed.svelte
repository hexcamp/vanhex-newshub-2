<script lang="ts" module>
	const safeParseUrl = (str: string): URL | null => {
		let url: URL | null | undefined;
		if ('parse' in URL) {
			url = URL.parse(str);
		} else {
			try {
				// @ts-expect-error: `'parse' in URL` is giving truthy
				url = new URL(str);
			} catch {}
		}

		if (url && (url.protocol === 'https:' || url.protocol === 'http:')) {
			return url;
		}

		return null;
	};
</script>

<script lang="ts">
	import type { AppBskyEmbedExternal } from '@atcute/client/lexicons';

	import { truncateRight } from '$lib/utils/strings';

	import EarthOutlined from '$lib/components/central-icons/earth-outlined.svelte';

	interface Props {
		embed: AppBskyEmbedExternal.View;
	}

	const { embed }: Props = $props();

	const external = embed.external;

	const domain = safeParseUrl(external.uri)?.host.replace(/^www\./, '');
</script>

<a target="_blank" href={domain && external.uri} rel="noopener noreferrer nofollow" class="external-embed">
	{#if external.thumb}
		<img loading="lazy" src={external.thumb} alt="" class="thumbnail" />
	{/if}

	<div class="meta">
		<p class="title">{truncateRight(external.title.trim().replace(/\s+/g, ' '), 190)}</p>
		<p class="description">{truncateRight(external.description.trim().replace(/\s+/g, ' '), 190)}</p>

		{#if domain}
			<div class="domain">
				<EarthOutlined />

				<span class="domain-name">{domain}</span>
			</div>
		{/if}
	</div>
</a>

<style>
	.external-embed {
		display: block;
		border: 1px solid var(--divider-md);
		border-radius: 6px;
		overflow: hidden;
		color: var(--text-primary);

		&:hover {
			background: var(--tap-sm);
		}
	}

	.thumbnail {
		display: block;
		border-bottom: 1px solid var(--divider-md);
		background: var(--bg-primary);
		aspect-ratio: 1.91;
		width: 100%;
		object-fit: cover;
	}

	.meta {
		padding: 12px;
	}

	.title {
		display: -webkit-box;
		overflow: hidden;
		font-weight: 700;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow-wrap: break-word;

		&:empty {
			display: none;
		}
	}
	.description {
		display: -webkit-box;
		overflow: hidden;
		color: var(--text-blurb);
		font-size: 0.8125rem;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		text-wrap: pretty;
		overflow-wrap: break-word;

		&:empty {
			display: none;
		}
	}

	.domain {
		display: flex;
		align-items: center;
		gap: 6px;
		margin: 6px 0 0 0;
		color: var(--text-blurb);
		font-weight: 500;
		font-size: 0.75rem;
	}
</style>
