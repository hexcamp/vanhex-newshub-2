import { segmentize } from '@atcute/bluesky-richtext-segmenter';
import type { AppBskyFeedDefs, AppBskyFeedPost, AppBskyRichtextFacet } from '@atcute/client/lexicons';

import { PUBLIC_APP_URL } from '$env/static/public';

import { findLabel, FlagsBlurMedia } from './moderation';
import { parseAddressedAtUri } from './types/at-uri';
import { getQuoteEmbedView, unwrapEmbedView } from './utils/bluesky/embeds';
import { assertNever } from './utils/invariant';
import type { UnwrapArray } from './utils/types';

export const escapeContent = (str: string) => {
	return str.replace(/[&<]/g, (c) => `&#${c.charCodeAt(0)};`);
};

export const escapeAttribute = (str: string) => {
	return str.replace(/[&"]/g, (c) => `&#${c.charCodeAt(0)};`);
};

export interface FeedItem {
	id?: string;
	url: string;
	title?: string;
	description?: string | { html: string };
	images?: Array<{
		src: string;
		thumbnailSrc?: string;
		adult?: boolean;
		alt?: string;
	}>;
	video?: {
		playerUrl: string;
		thumbnailSrc?: string;
		adult?: boolean;
		alt?: string;
	};
	date?: Date;
}

export interface FeedOptions {
	meta: {
		title: string;
		description: string;
		pageUrl: string;
		rssUrl?: string;
		image?: {
			src: string;
		};
	};
	items: FeedItem[];
}

export const createRssFeed = (options: FeedOptions) => {
	const {
		meta: { title, description, pageUrl, rssUrl, image },
		items,
	} = options;

	let rss = `<?xml version="1.0" encoding="UTF-8" ?>`;
	rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">`;
	rss += `<channel>`;

	{
		rss += `<title>${escapeContent(title)}</title>`;
		rss += `<link>${escapeContent(pageUrl)}</link>`;
		rss += `<description>${escapeContent(escapeContent(description))}</description>`;

		if (rssUrl !== undefined) {
			rss += `<atom:link href="${escapeAttribute(rssUrl)}" rel="self" type="application/rss+xml"/>`;
		}

		if (image !== undefined) {
			rss += `<image>`;
			rss += `<url>${escapeContent(image.src)}</url>`;
			rss += `<title>${escapeContent(title)}</title>`;
			rss += `<link>${escapeContent(pageUrl)}</link>`;

			rss += `</image>`;
		}
	}

	for (const { id, url, title, description, images, video, date } of items) {
		rss += `<item>`;

		if (id !== undefined) {
			rss += `<guid isPermaLink="false">${escapeContent(id)}</guid>`;
		}

		rss += `<link>${escapeContent(url)}</link>`;

		if (date !== undefined) {
			rss += `<pubDate>${date.toUTCString()}</pubDate>`;
		}

		if (title !== undefined) {
			rss += `<title>${escapeContent(title)}</title>`;
		}

		if (description !== undefined) {
			const value = typeof description === 'string' ? escapeContent(description) : description.html;
			rss += `<description>${escapeContent(value)}</description>`;
		}

		if (images !== undefined) {
			for (const { src: url, adult, thumbnailSrc: thumbnail, alt } of images) {
				rss += `<media:content url="${escapeAttribute(url)}" medium="image">`;
				rss += `<media:rating scheme="urn:simple">${adult ? 'adult' : 'nonadult'}</media:rating>`;

				if (alt !== undefined) {
					rss += `<media:description type="plain">${escapeContent(alt)}</media:description>`;
				}
				if (thumbnail !== undefined) {
					rss += `<media:thumbnail url="${escapeAttribute(thumbnail)}"/>`;
				}

				rss += `</media:content>`;
			}
		}

		if (video !== undefined) {
			const { playerUrl, thumbnailSrc, adult, alt } = video;
			rss += `<media:content medium="video">`;
			rss += `<media:player url="${escapeAttribute(playerUrl)}"/>`;
			rss += `<media:rating scheme="urn:simple">${adult ? 'adult' : 'nonadult'}</media:rating>`;

			if (thumbnailSrc !== undefined) {
				rss += `<media:thumbnail url="${escapeAttribute(thumbnailSrc)}"/>`;
			}

			if (alt !== undefined) {
				rss += `<media:description type="plain">${escapeContent(alt)}</media:description>`;
			}

			rss += `</media:content>`;
		}

		rss += `</item>`;
	}

	rss += `</channel>`;
	rss += `</rss>`;
	return rss;
};

export const richtextToHtml = (text: string, facets: AppBskyRichtextFacet.Main[] | undefined) => {
	let html = '';

	for (const segment of segmentize(text, facets)) {
		const feature = grabFirstSupported(segment.features);
		const subtext = escapeContent(segment.text).replace(/\n/g, '<br>');

		switch (feature?.$type) {
			case undefined: {
				html += subtext;
				break;
			}
			case 'app.bsky.richtext.facet#link': {
				html += `<a class="link" href="${escapeAttribute(feature.uri)}">${subtext}</a>`;
				break;
			}
			case 'app.bsky.richtext.facet#mention': {
				const href = `${PUBLIC_APP_URL}/${feature.did}`;
				html += `<a class="mention" href="${escapeAttribute(href)}">${subtext}</a>`;
				break;
			}
			case 'app.bsky.richtext.facet#tag': {
				const href = `${PUBLIC_APP_URL}/search/posts?q=${encodeURIComponent('#' + feature.tag)}`;
				html += `<a class="hashtag" href="${escapeAttribute(href)}">${subtext}</a>`;
				break;
			}
			default: {
				assertNever(feature);
			}
		}
	}

	return html;
};

export const feedPostToFeedItem = (item: AppBskyFeedDefs.FeedViewPost): FeedItem => {
	const post = item.post;
	const author = post.author;

	const record = post.record as AppBskyFeedPost.Record;

	const { media, record: recordEmbed } = unwrapEmbedView(post.embed);
	const quote = getQuoteEmbedView(recordEmbed);

	const shouldBlurMedia = !!findLabel(post.labels, author.did, FlagsBlurMedia);

	let html = richtextToHtml(record.text, record.facets);
	if (quote) {
		html += `<br><br>`;

		switch (quote.$type) {
			case 'app.bsky.embed.record#viewRecord': {
				const author = quote.author;
				const record = quote.value as AppBskyFeedPost.Record;

				const postUrl = `${PUBLIC_APP_URL}/${author.did}/${parseAddressedAtUri(quote.uri).rkey}`;

				html += `<blockquote>`;
				html += `<b><a href="${escapeAttribute(postUrl)}">`;

				if (author.displayName?.trim()) {
					html += `${escapeContent(author.displayName.trim())} (@${escapeContent(author.handle)})`;
				} else {
					html += `@${escapeContent(author.handle)}`;
				}

				html += `</a></b><br>`;

				html += richtextToHtml(record.text, record.facets);
				html += `</blockquote>`;
				break;
			}
			case 'app.bsky.embed.record#viewNotFound':
			case 'app.bsky.embed.record#viewBlocked':
			case 'app.bsky.embed.record#viewDetached': {
				html += `<blockquote>Post not found</blockquote>`;
				break;
			}
		}
	}

	return {
		id: `${post.uri}|${post.cid}`,
		url: `${PUBLIC_APP_URL}/${author.did}/${parseAddressedAtUri(post.uri).rkey}`,
		date: new Date(post.indexedAt),
		description: { html },
		images:
			media?.$type === 'app.bsky.embed.images#view'
				? media.images.map((image) => ({
						src: image.fullsize,
						thumbnailSrc: image.thumb,
						adult: shouldBlurMedia,
						alt: image.alt,
					}))
				: undefined,
		video:
			media?.$type === 'app.bsky.embed.video#view'
				? {
						playerUrl: getVideoUrl(media.playlist),
						thumbnailSrc: media.thumbnail,
						adult: shouldBlurMedia,
						alt: media.alt,
					}
				: undefined,
	};
};

const getVideoUrl = (playlistUrl: string) => {
	const MATCH_RE = /\/(did:[a-z]+:[a-zA-Z0-9._:%-]*[a-zA-Z0-9._-])\/(bafkrei[2-7a-z]{52})\//;
	const match = MATCH_RE.exec(decodeURIComponent(playlistUrl));
	if (!match) {
		return '';
	}

	return `${PUBLIC_APP_URL}/watch/${match[1]}/${match[2]}`;
};

type FacetFeature = UnwrapArray<AppBskyRichtextFacet.Main['features']>;
const grabFirstSupported = (features: FacetFeature[] | undefined): FacetFeature | undefined => {
	return features?.find(
		(feature) =>
			feature.$type === 'app.bsky.richtext.facet#link' ||
			feature.$type === 'app.bsky.richtext.facet#mention' ||
			feature.$type === 'app.bsky.richtext.facet#tag',
	);
};
