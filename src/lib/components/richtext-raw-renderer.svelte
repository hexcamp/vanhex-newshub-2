<script lang="ts" module>
	const HTTP_RE = /^https?:\/\//;
</script>

<script lang="ts">
	import { base } from '$app/paths';
	import { redirectBskyUrl } from '$lib/redirector';

	import { tokenize } from '@atcute/bluesky-richtext-parser';

	interface Props {
		text: string;
		large?: boolean;
	}

	const { text, large }: Props = $props();
</script>

<p class={`rich-text` + (large ? ` is-large` : ` is-small`)}>
	{#each tokenize(text) as token}
		{#if token.type === 'autolink'}
			{@const redirectUrl = redirectBskyUrl(token.url)}
			{@const label = token.raw.replace(HTTP_RE, '')}

			{#if redirectUrl}
				<a href={redirectUrl} class="link">{label}</a>
			{:else}
				<a target="_blank" href={token.url} rel="noopener nofollow" class="link">
					{label}
				</a>
			{/if}
		{:else if token.type === 'mention'}
			<a href="{base}/{token.handle.toLowerCase()}" class="mention">{token.raw}</a>
		{:else if token.type === 'topic'}
			<a href="{base}/search/posts?q={encodeURIComponent('#' + token.name)}" class="hashtag">{token.raw}</a>
		{:else}
			{token.raw}
		{/if}
	{/each}
</p>

<style>
	.rich-text {
		margin: -2px;
		padding: 2px;
		overflow: hidden;
		white-space: pre-wrap;
		overflow-wrap: break-word;

		&:empty {
			display: none;
		}
	}
	.is-large {
		font-size: 1rem;
		line-height: 1.5rem;
	}

	.link,
	.mention,
	.hashtag {
		color: var(--text-link);

		&:hover {
			text-decoration: underline;
		}
	}
</style>
