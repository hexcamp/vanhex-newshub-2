<script lang="ts">
	import type { AppBskyActorDefs } from '@atcute/bluesky';

	import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';

	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { truncateMiddle } from '$lib/utils/strings';

	interface Props {
		profile: AppBskyActorDefs.ProfileViewDetailed;
	}

	const { profile }: Props = $props();

	const displayName = $derived(normalizeDisplayName(profile.displayName ?? ''));
	const handle = $derived(truncateMiddle(profile.handle, 29));
	const description = $derived(trimRichText(profile.description ?? ''));
</script>

<svelte:head>
	<meta property="og:site_name" content={PUBLIC_APP_NAME} />
	<meta property="og:type" content="profile" />
	<meta property="twitter:card" content="summary" />
	<meta property="og:url" content="{PUBLIC_APP_URL}/{profile.did}" />
	<meta property="profile:username" content={profile.handle} />
	<meta property="og:title" content={displayName ? `${displayName} (@${handle})` : `@${handle}`} />
	<meta property="og:description" content={description} />

	{#if profile.avatar}
		<meta property="og:image" content={profile.avatar.replace('@jpeg', '@png')} />
	{/if}
</svelte:head>
