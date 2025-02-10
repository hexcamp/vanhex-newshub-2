<script lang="ts">
	import type { AppBskyActorDefs } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import { formatCompactNumber, formatLongNumber } from '$lib/utils/intl/number';

	import RichtextRawRenderer from '$lib/components/richtext-raw-renderer.svelte';

	interface Props {
		profile: AppBskyActorDefs.ProfileViewDetailed;
	}

	const { profile }: Props = $props();

	const did = $derived(profile.did);
</script>

{#snippet Stat(count: number = 0, one: string, many: string, href: string)}
	{@const compact = formatCompactNumber(count)}
	{@const long = formatLongNumber(count)}

	<a
		href="{base}/{did}/{href}"
		title={compact !== long ? (count === 1 ? `${long} ${one}` : `${long} ${many}`) : ''}
		class="stat-entry"
	>
		<span class="stat-count">{compact}</span>
		<span> {count === 1 ? one : many}</span>
	</a>
{/snippet}

<div class="profile-aside">
	<div class="avatar-wrapper">
		<img loading="lazy" src={profile.avatar} alt="" class="avatar" />
	</div>

	<div class="name-wrapper">
		<p dir="auto" class="display-name">{profile.displayName?.trim() || profile.handle.slice(0, 64)}</p>
		<p class="handle">@{profile.handle}</p>
	</div>

	{#if profile.description?.trim()}
		<RichtextRawRenderer text={profile.description} />
	{/if}

	<div class="stats">
		{@render Stat(profile.followersCount, 'follower', 'followers', 'followers')}
		{@render Stat(profile.followsCount, 'following', 'following', 'following')}
	</div>
</div>

<style>
	.profile-aside {
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: var(--bg-primary);
		padding: 16px;
		min-width: 0;
	}

	.avatar-wrapper {
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--bg-secondary);
		aspect-ratio: 1 / 1;
		width: 100%;
		max-width: 90px;
		overflow: hidden;
	}
	.avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.display-name {
		font-weight: 700;
		font-size: 1.25rem;
		line-height: 1.75rem;
		overflow-wrap: break-word;
	}
	.handle {
		color: var(--text-blurb);
		overflow-wrap: break-word;
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;

		min-width: 0;
	}
	.stat-entry {
		color: var(--text-blurb);

		&:hover {
			text-decoration: underline;
		}
	}
	.stat-count {
		color: var(--text-primary);
		font-weight: 700;
	}
</style>
