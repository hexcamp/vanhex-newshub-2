<script lang="ts">
	import type { AppBskyGraphDefs } from '@atcute/client/lexicons';

	import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';

	import { parseAddressedAtUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { purposeToLabel } from '$lib/utils/bluesky/lists';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { truncateMiddle } from '$lib/utils/strings';

	interface Props {
		list: AppBskyGraphDefs.ListView;
	}

	const { list }: Props = $props();

	const uri = $derived(parseAddressedAtUri(list.uri));

	const description = $derived.by(() => {
		const desc = trimRichText(list.description ?? '');

		let str = '';

		str += `${purposeToLabel(list.purpose)} by @${truncateMiddle(list.creator.handle, 29)}`;

		if (desc) {
			str += `\n\n${desc}`;
		}

		return str;
	});
</script>

<svelte:head>
	<meta property="og:site_name" content={PUBLIC_APP_NAME} />
	<meta property="twitter:card" content="summary" />
	<meta property="og:url" content="{PUBLIC_APP_URL}/{uri.repo}/lists/{uri.rkey}" />
	<meta property="og:title" content={normalizeDisplayName(list.name)} />
	<meta property="og:description" content={description} />

	{#if list.avatar}
		<meta property="og:image" content={list.avatar.replace('@jpeg', '@png')} />
	{/if}
</svelte:head>
