import type { At } from '@atcute/client/lexicons';

// Popular feeds that requires authentication to view
export const AUTHENTICATED_FEEDS: At.CanonicalResourceUri[] = [
	// "Popular With Friends" by @bsky.app
	`at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/with-friends`,
	// "Mutuals" by @skyfeed.xyz
	`at://did:plc:tenurhgjptubkk5zf5qhi3og/app.bsky.feed.generator/mutuals`,
	// "Only Posts" by @skyfeed.xyz
	`at://did:plc:tenurhgjptubkk5zf5qhi3og/app.bsky.feed.generator/only-posts`,
	// "Mentions" by @flicknow.xyz
	`at://did:plc:wzsilnxf24ehtmmc3gssy5bu/app.bsky.feed.generator/mentions`,
	// "My Bangers" by @jaz.bsky.social
	`at://did:plc:q6gjnaw2blty4crticxkmujt/app.bsky.feed.generator/bangers`,
	// "Mutuals" by @bsky.app
	`at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/mutuals`,
	// "Media" by @jcsalterego.bsky.social
	`at://did:plc:vc7f4oafdgxsihk4cry2xpze/app.bsky.feed.generator/media`,
	// "The 'Gram" by @why.bsky.team
	`at://did:plc:vpkhqolt662uhesyj6nxm7ys/app.bsky.feed.generator/followpics`,
	// "Discover" by @skyfeed.xyz
	`at://did:plc:tenurhgjptubkk5zf5qhi3og/app.bsky.feed.generator/discover`,
	// "Latest from Follows" by @why.bsky.team
	`at://did:plc:vpkhqolt662uhesyj6nxm7ys/app.bsky.feed.generator/bestoffollows`,
	// "Teams" by @retr0.id
	`at://did:plc:vwzwgnygau7ed7b7wt5ux7y2/app.bsky.feed.generator/teams`,
	// "Quiet Posters" by @why.bsky.team
	`at://did:plc:vpkhqolt662uhesyj6nxm7ys/app.bsky.feed.generator/infreq`,
	// "Best of Follows" by @bsky.app
	`at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/best-of-follows`,
	// "FollowersLike" by @why.bsky.team
	`at://did:plc:vpkhqolt662uhesyj6nxm7ys/app.bsky.feed.generator/followlikes`,
	// "Re+Posts" by @skyfeed.xyz
	`at://did:plc:tenurhgjptubkk5zf5qhi3og/app.bsky.feed.generator/re-plus-posts`,
];
