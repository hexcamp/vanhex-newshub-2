<script lang="ts">
	import type { AppBskyFeedDefs, AppBskyFeedPost } from '@atcute/client/lexicons';

	import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';

	import { parseAtUri } from '$lib/types/at-uri';
	import { unwrapEmbedView } from '$lib/utils/bluesky/embeds';
	import { truncateMiddle } from '$lib/utils/strings';
	import { collectionToLabel } from '$lib/utils/bluesky/records';

	interface Props {
		post: AppBskyFeedDefs.PostView;
	}

	const { post }: Props = $props();

	const uri = $derived(parseAtUri(post.uri));

	const author = $derived(post.author);
	const { media, record } = $derived(unwrapEmbedView(post.embed));

	const description = $derived.by(() => {
		let content = (post.record as AppBskyFeedPost.Record).text.trim();

		switch (media?.$type) {
			case 'app.bsky.embed.external#view': {
				content += `\n\n[contains external link]`;
				break;
			}
			case 'app.bsky.embed.video#view': {
				content += `\n\n[contains video]`;
				break;
			}
		}

		if (record) {
			const view = record.record;
			switch (view.$type) {
				case 'app.bsky.embed.record#viewRecord': {
					content += `\n\n[quoting @${view.author.handle}]`;
					break;
				}
				case 'app.bsky.feed.defs#generatorView': {
					content += `\n\n[contains embedded feed]`;
					break;
				}
				case 'app.bsky.graph.defs#listView': {
					content += `\n\n[contains embedded list]`;
					break;
				}
				case 'app.bsky.graph.defs#starterPackViewBasic': {
					content += `\n\n[contains embedded starter pack]`;
					break;
				}
				default: {
					const uri = parseAtUri(view.uri);
					const resource = collectionToLabel(uri.collection);

					const isUnavailable =
						resource &&
						(view.$type === 'app.bsky.embed.record#viewNotFound' ||
							view.$type === 'app.bsky.embed.record#viewBlocked' ||
							view.$type === 'app.bsky.embed.record#viewDetached');

					content += isUnavailable
						? `\n\n[contains unavailable ${resource} embed]`
						: `\n\n[contains unknown embed]`;

					break;
				}
			}
		}

		return content;
	});
</script>

<svelte:head>
	<meta property="og:site_name" content={PUBLIC_APP_NAME} />
	<meta property="og:type" content="article" />
	<meta property="twitter:card" content="summary" />
	<meta property="og:url" content="{PUBLIC_APP_URL}/{uri.repo}/{uri.rkey}" />
	<meta property="profile:username" content={author.handle} />
	<meta property="og:published_time" content={post.indexedAt} />
	<meta
		property="og:title"
		content={author.displayName?.trim()
			? `${author.displayName.trim()} (@${truncateMiddle(post.author.handle, 29)})`
			: `@${truncateMiddle(post.author.handle, 29)}`}
	/>
	<meta property="og:description" content={description} />

	{#if media?.$type === 'app.bsky.embed.images#view'}
		{#each media.images as image}
			<meta property="og:image" content={image.fullsize} />
		{/each}
	{/if}
</svelte:head>
