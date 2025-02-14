<script lang="ts">
	import { base } from '$app/paths';
	import type { LayoutProps } from './$types';

	import { findLabel, FlagsBlurMedia } from '$lib/moderation';
	import { formatCompactNumber } from '$lib/utils/intl/number';

	import ProfileAside from './components/profile-aside.svelte';

	const { children, data }: LayoutProps = $props();

	const profile = $derived(data.profile);
	const did = $derived(profile.did);

	const postCount = $derived(profile.postsCount ?? 0);
	const blurBanner = $derived(!!findLabel(profile.labels, profile.did, FlagsBlurMedia));
</script>

<svelte:head>
	<link rel="canonical" href="{base}/{data.profile.did}" />
	<link rel="alternate" href="at://{data.profile.did}/app.bsky.actor.profile/self" />
</svelte:head>

{#key profile.did}
	<div class="profile-layout">
		<div class="banner">
			{#if profile.banner}
				<img
					loading="lazy"
					src={profile.banner}
					alt=""
					class={['banner-image', blurBanner && 'is-blurred']}
				/>
			{/if}
		</div>

		<div class="aside">
			<ProfileAside {profile} />

			<div class="associations">
				<a class="association" href="{base}/{did}">
					<span class="association-count">{formatCompactNumber(postCount)}</span>
					{postCount === 1 ? `post` : `posts`}
				</a>

				{#if profile.associated?.feedgens}
					{@const count = profile.associated.feedgens}

					<a class="association" href="{base}/{did}/feeds">
						<span class="association-count">{formatCompactNumber(count)}</span>
						{count === 1 ? `feed` : `feeds`}
					</a>
				{/if}
				{#if profile.associated?.lists}
					{@const count = profile.associated.lists}

					<a class="association" href="{base}/{did}/lists">
						<span class="association-count">{formatCompactNumber(count)}</span>
						{count === 1 ? `list` : `lists`}
					</a>
				{/if}
				{#if profile.associated?.starterPacks}
					{@const count = profile.associated.starterPacks}

					<a class="association" href="{base}/{did}/packs">
						<span class="association-count">{formatCompactNumber(count)}</span>
						{count === 1 ? `starter pack` : `starter packs`}
					</a>
				{/if}
			</div>
		</div>

		<div class="main">
			{@render children()}
		</div>
	</div>
{/key}

<style>
	.profile-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas: 'banner' 'aside' 'main';
		justify-content: center;
		gap: 8px;
		margin: 24px auto 0;
		max-width: 480px;

		@media (width >= 640px) {
			grid-template-columns: minmax(255px, 320px) minmax(0, 600px);
			grid-template-areas: 'banner banner' 'aside main';
			max-width: 960px;
		}
	}

	.banner {
		grid-area: banner;
		background: var(--divider-md);
		aspect-ratio: 3 / 1;
		overflow: hidden;
	}
	.banner-image {
		width: 100%;
		height: 100%;
		font-size: 0;
	}
	.is-blurred {
		scale: 125%;
		filter: blur(24px);
	}

	.aside {
		display: flex;
		grid-area: aside;
		flex-direction: column;
		gap: 8px;

		@media (width >= 640px) {
			position: sticky;
			top: 0;
			max-height: 100dvh;
			overflow-y: auto;
		}
	}

	.associations {
		display: flex;
		flex-direction: column;
		background: var(--bg-primary);
	}
	.association {
		padding: 10px 16px;
		color: var(--text-blurb);

		& + & {
			border-top: 1px solid var(--divider-sm);
		}

		&:hover {
			background: var(--tap-sm);
		}
	}
	.association-count {
		color: var(--text-primary);
		font-weight: 600;
	}

	.main {
		grid-area: main;
		padding-bottom: 24px;
	}
</style>
