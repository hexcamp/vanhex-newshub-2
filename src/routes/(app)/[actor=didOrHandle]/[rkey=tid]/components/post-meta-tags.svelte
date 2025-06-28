<script lang="ts">
	import { unwrapEmbed, type AppBskyFeedDefs, type AppBskyFeedPost } from '@atcute/bluesky';

	import { PUBLIC_APP_NAME, PUBLIC_APP_URL } from '$env/static/public';

	import { assertCanonicalResourceUri } from '$lib/types/at-uri';
	import { normalizeDisplayName } from '$lib/utils/bluesky/display';
	import { collectionToLabel } from '$lib/utils/bluesky/records';
	import { trimRichText } from '$lib/utils/bluesky/richtext';
	import { truncateMiddle } from '$lib/utils/strings';

	interface Props {
		post: AppBskyFeedDefs.PostView;
	}

	const { post }: Props = $props();

	const uri = $derived(assertCanonicalResourceUri(post.uri));

	const author = $derived(post.author);
	const displayName = $derived(normalizeDisplayName(author.displayName ?? ''));
	const handle = $derived(truncateMiddle(author.handle, 29));

	const { media, record } = $derived(unwrapEmbed(post.embed));

	const description = $derived.by(() => {
		const content = trimRichText((post.record as AppBskyFeedPost.Main).text);
		let footer = '';

		switch (media?.$type) {
			case 'app.bsky.embed.external#view': {
				footer && (footer += '\n');
				footer += `[contains external link]`;
				break;
			}
			case 'app.bsky.embed.video#view': {
				footer && (footer += '\n');
				footer += `[contains video]`;
				break;
			}
		}

		if (record) {
			switch (record.$type) {
				case 'app.bsky.embed.record#viewRecord': {
					footer && (footer += '\n');
					footer += `[quoting @${truncateMiddle(record.author.handle, 29)}]`;
					break;
				}
				case 'app.bsky.feed.defs#generatorView': {
					footer && (footer += '\n');
					footer += `[contains embedded feed]`;
					break;
				}
				case 'app.bsky.graph.defs#listView': {
					footer && (footer += '\n');
					footer += `[contains embedded list]`;
					break;
				}
				case 'app.bsky.graph.defs#starterPackViewBasic': {
					footer && (footer += '\n');
					footer += `[contains embedded starter pack]`;
					break;
				}
				default: {
					const uri = assertCanonicalResourceUri(record.uri);
					const resource = collectionToLabel(uri.collection);

					const isUnavailable =
						resource &&
						(record.$type === 'app.bsky.embed.record#viewNotFound' ||
							record.$type === 'app.bsky.embed.record#viewBlocked' ||
							record.$type === 'app.bsky.embed.record#viewDetached');

					footer && (footer += '\n');
					footer += isUnavailable ? `[contains unavailable ${resource} embed]` : `[contains unknown embed]`;

					break;
				}
			}
		}

		return content + (footer ? `\n\n${footer}` : '');
	});
</script>

<svelte:head>
	<meta property="og:site_name" content={PUBLIC_APP_NAME} />
	<meta property="og:type" content="article" />
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="og:url" content="{PUBLIC_APP_URL}/{uri.repo}/{uri.rkey}#main" />
	<meta property="profile:username" content={author.handle} />
	<meta property="og:published_time" content={post.indexedAt} />
	<meta property="og:title" content={displayName ? `${displayName} (@${handle})` : `@${handle}`} />
	<meta property="og:description" content={description} />

	{#if media?.$type === 'app.bsky.embed.images#view'}
		{#each media.images as image}
			<meta property="og:image" content={image.fullsize.replace('@jpeg', '@png')} />
		{/each}
	{/if}

	<!-- Nasty hack that gives pretty iMessage link embeds -->
	<link type="application/activity+json" href="" />
</svelte:head>
