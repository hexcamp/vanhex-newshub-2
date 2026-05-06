<script lang="ts">
	import type { AppBskyFeedDefs } from '@atcute/bluesky';

	import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { truncateMiddle } from '$lib/utils/strings';

	interface Props {
		feed: AppBskyFeedDefs.GeneratorView;
	}

	const { feed }: Props = $props();

	const uri = $derived(assertCanonicalResourceUri(feed.uri));

	const description = $derived.by(() => {
		const desc = trimRichText(feed.description ?? '');

		let str = '';

		str += `Feed by @${truncateMiddle(feed.creator.handle, 29)}`;

		if (desc) {
			str += `\n\n${desc}`;
		}

		return str;
	});
</script>

<svelte:head>
	<meta property="og:site_name" content={PUBLIC_APP_NAME} />
	<meta property="twitter:card" content="summary" />
	<meta property="og:url" content="{PUBLIC_APP_URL}/{uri.repo}/feeds/{uri.rkey}" />
	<meta property="og:title" content={normalizeDisplayName(feed.displayName)} />
	<meta property="og:description" content={description} />

	{#if feed.avatar}
		<meta property="og:image" content={feed.avatar.replace('@jpeg', '@png')} />
	{/if}
</svelte:head>
