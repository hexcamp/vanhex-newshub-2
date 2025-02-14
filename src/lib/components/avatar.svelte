<script lang="ts" module>
	import DefaultFeedAvatar from '$lib/assets/default-feed-avatar.svg?url';
	import DefaultLabelerAvatar from '$lib/assets/default-labeler-avatar.svg?url';
	import DefaultListAvatar from '$lib/assets/default-list-avatar.svg?url';
	import DefaultStarterpackAvatar from '$lib/assets/default-starterpack-avatar.svg?url';
	import DefaultUserAvatar from '$lib/assets/default-user-avatar.svg?url';

	const AVATARS = {
		generator: DefaultFeedAvatar,
		labeler: DefaultLabelerAvatar,
		list: DefaultListAvatar,
		starterpack: DefaultStarterpackAvatar,
		user: DefaultUserAvatar,
	};
</script>

<script lang="ts">
	import type { AppBskyActorDefs } from '@atcute/client/lexicons';

	interface Props {
		profile?:
			| AppBskyActorDefs.ProfileViewBasic
			| AppBskyActorDefs.ProfileView
			| AppBskyActorDefs.ProfileViewDetailed;
		type?: keyof typeof AVATARS;
		src?: string;
		tabindex?: number;
		title?: string;
		href?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		blur?: boolean;
	}

	const {
		profile,
		type = profile?.associated?.labeler ? 'labeler' : 'user',
		src = profile?.avatar,
		tabindex,
		title,
		href,
		size = 'md',
		blur,
	}: Props = $props();
</script>

{#snippet Image()}
	<img
		loading="lazy"
		src={src ?? AVATARS[type]}
		alt=""
		class={['image', src && 'has-src', src && blur && 'is-blurred']}
	/>
{/snippet}

{#if href}
	<a {tabindex} {href} {title} class={['avatar', `is-${size}`, `is-${type}`]}>
		{@render Image()}
	</a>
{:else}
	<div class={['avatar', `is-${size}`, `is-${type}`]}>
		{@render Image()}
	</div>
{/if}

<style>
	.avatar {
		display: block;
		flex-shrink: 0;
		align-self: start;
		border-radius: 16.67%; /* 6px / 36px * 100% */
		aspect-ratio: 1;
		overflow: hidden;

		a& {
			&:hover {
				filter: brightness(0.8);
			}
		}
	}
	.is-user {
		border-radius: 9999px;
	}

	.is-xs {
		width: 20px;
	}
	.is-sm {
		width: 24px;
	}
	.is-md {
		width: 36px;
	}
	.is-lg {
		width: 40px;
	}
	.is-xl {
		width: 90px;
	}

	.image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.has-src {
		background: var(--divider-md);
	}
	.is-blurred {
		scale: 125%;
		filter: blur(4px);
	}
</style>
