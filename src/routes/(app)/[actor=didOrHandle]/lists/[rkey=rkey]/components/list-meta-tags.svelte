<script lang="ts">
	import type { AppBskyGraphDefs } from '@atcute/client/lexicons';

	import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';

	import { parseAtUri } from '$lib/types/at-uri';
	import { purposeToLabel } from '$lib/utils/bluesky/lists';

	interface Props {
		list: AppBskyGraphDefs.ListView;
	}

	const { list }: Props = $props();

	const uri = $derived(parseAtUri(list.uri));

	const description = $derived.by(() => {
		const desc = list.description?.trim();

		let str = '';

		str += `${purposeToLabel(list.purpose)} by @${list.creator.handle}`;

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
	<meta property="og:title" content={list.name.trim()} />
	<meta property="og:description" content={description} />

	{#if list.avatar}
		<meta property="og:image" content={list.avatar.replace('@jpeg', '@png')} />
	{/if}
</svelte:head>
