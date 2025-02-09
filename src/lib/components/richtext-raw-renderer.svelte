<script lang="ts" module>
	const HTTP_RE = /^https?:\/\//;
</script>

<script lang="ts">
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
			<a target="_blank" href={token.url} rel="noopener nofollow" class="link">
				{token.raw.replace(HTTP_RE, '')}
			</a>
		{:else if token.type === 'mention'}
			<a href="/{token.handle}" class="mention">{token.raw}</a>
		{:else if token.type === 'topic'}
			<span class="hashtag">{token.raw}</span>
		{:else}
			{token.raw}
		{/if}
	{/each}
</p>

<style>
	.rich-text {
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
