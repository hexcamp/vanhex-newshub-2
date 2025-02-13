<script lang="ts">
	import type { AppBskyActorDefs } from '@atcute/client/lexicons';

	import { base } from '$app/paths';

	import Avatar from '$lib/components/avatar.svelte';

	interface Props {
		item: AppBskyActorDefs.ProfileView | AppBskyActorDefs.ProfileViewBasic;
	}

	const { item: profile }: Props = $props();

	const href = $derived(`${base}/${profile.did}`);
</script>

<div class="profile-item">
	<div class="aside">
		<Avatar {profile} tabindex={-1} {href} />
	</div>

	<div class="main">
		<div class="content">
			<a {href} class="name-wrapper">
				<p class="display-name">{profile.displayName}</p>
				<p class="handle">@{profile.handle}</p>
			</a>
		</div>

		{#if 'description' in profile && profile.description?.trim()}
			<p class="bio">{profile.description}</p>
		{/if}
	</div>
</div>

<style>
	.profile-item {
		display: flex;
		gap: 12px;
		contain: content;
		padding: 12px 16px;

		@media (hover: hover) {
			&:hover {
				background: var(--tap-sm);
			}
		}
	}

	.aside {
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		align-items: center;

		:global(.avatar) {
			margin: 2px;
		}
	}

	.main {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}

	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		margin: auto 0;
		height: 40px;
	}

	.name-wrapper {
		min-width: 0;
	}
	.display-name {
		overflow: hidden;
		color: var(--text-primary);
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;

		&:empty {
			color: var(--text-muted);
		}

		.name-wrapper:hover & {
			text-decoration: underline;
		}
	}
	.handle {
		overflow: hidden;
		color: var(--text-blurb);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bio {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>
