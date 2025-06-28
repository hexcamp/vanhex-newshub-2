<script lang="ts">
	import type { AppBskyFeedDefs } from '@atcute/bluesky';

	import { base } from '$app/paths';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';

	interface Props {
		count: number;
		post: AppBskyFeedDefs.PostView;
	}

	const { count, post }: Props = $props();
</script>

<div class="missing-descendant-item">
	<span class="label">{count === 1 ? `${count} missing reply` : `${count} missing replies`}</span>
	<a href="{base}/{post.author.did}/{assertCanonicalResourceUri(post.uri).rkey}/all-replies" class="link"
		>View</a
	>
</div>

<style>
	.missing-descendant-item {
		display: flex;
		gap: 16px;
		padding: 12px 16px;
		color: var(--text-blurb);
	}

	.label {
		font-style: italic;
	}

	.link {
		&:hover {
			text-decoration: underline;
		}
	}
</style>
