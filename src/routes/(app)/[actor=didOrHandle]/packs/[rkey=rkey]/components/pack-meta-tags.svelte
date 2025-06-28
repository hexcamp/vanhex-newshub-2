<script lang="ts">
	import type { AppBskyGraphDefs, AppBskyGraphStarterpack } from '@atcute/bluesky';

	import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { truncateMiddle } from '$lib/utils/strings';

	interface Props {
		pack: AppBskyGraphDefs.StarterPackView;
	}

	const { pack }: Props = $props();

	const uri = $derived(assertCanonicalResourceUri(pack.uri));
	const record = $derived(pack.record as AppBskyGraphStarterpack.Main);

	const description = $derived.by(() => {
		const desc = trimRichText(record.description ?? '');

		let str = '';

		str += `Starter pack by @${truncateMiddle(pack.creator.handle, 29)}`;

		if (desc) {
			str += `\n\n${desc}`;
		}

		return str;
	});
</script>

<svelte:head>
	<meta property="og:site_name" content={PUBLIC_APP_NAME} />
	<meta property="twitter:card" content="summary" />
	<meta property="og:url" content="{PUBLIC_APP_URL}/{uri.repo}/packs/{uri.rkey}" />
	<meta property="og:title" content={normalizeDisplayName(record.name)} />
	<meta property="og:description" content={description} />
</svelte:head>
