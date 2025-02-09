<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	import { base } from '$app/paths';
	import { page } from '$app/state';

	import type { LayoutProps } from './$types';

	const { data, children }: LayoutProps = $props();

	const did = $derived(data.profile.did);
	const currentRouteId = $derived(page.route.id);

	const cn = (routeId: string): ClassValue => {
		const id = `/(app)/(profile)/[actor=didOrHandle]/(timeline)${routeId}`;
		return ['tab', currentRouteId === id && 'is-active'];
	};
</script>

<div class="profile-tabs" data-sveltekit-keepfocus>
	<a class={cn('')} href="{base}/{did}">Posts</a>
	<a class={cn('/with_replies')} href="{base}/{did}/with_replies">Replies</a>
	<a class={cn('/media')} href="{base}/{did}/media">Media</a>
</div>

{@render children()}

<style>
	.profile-tabs {
		display: flex;
		position: sticky;
		top: 0;
		flex-wrap: wrap;
		z-index: 1;
		border-bottom: 1px solid var(--divider-sm);
		background: var(--bg-primary);
	}

	.tab {
		padding: 12px 16px;
		font-weight: 600;
		font-size: 1rem;
		line-height: 1.5rem;

		&:hover {
			text-decoration: underline;
		}

		&.is-active {
			color: var(--text-primary);
		}
	}
</style>
