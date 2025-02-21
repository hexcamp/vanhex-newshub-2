<script lang="ts">
	import type { AppBskyActorDefs } from '@atcute/client/lexicons';

	import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';

	interface Props {
		profile: AppBskyActorDefs.ProfileViewDetailed;
	}

	const { profile }: Props = $props();
</script>

<svelte:head>
	<meta property="og:site_name" content={PUBLIC_APP_NAME} />
	<meta property="og:type" content="profile" />
	<meta property="twitter:card" content="summary" />
	<meta property="og:url" content="{PUBLIC_APP_URL}/{profile.did}" />
	<meta property="profile:username" content={profile.handle} />
	<meta
		property="og:title"
		content={profile.displayName?.trim()
			? `${profile.displayName} (@${profile.handle})`
			: `@${profile.handle}`}
	/>
	<meta property="og:description" content={profile.description} />

	{#if profile.avatar}
		<meta property="og:image" content={profile.avatar.replace('@jpeg', '@png')} />
	{/if}
</svelte:head>
