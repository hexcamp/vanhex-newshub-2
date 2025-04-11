import type { At, ComAtprotoLabelDefs } from '@atcute/client/lexicons';

export const FlagsNone = 0;

/** Label blurs media (images and videos in posts) */
export const FlagsBlurMedia = 1 << 0;
/** Label blurs content (text in posts), assumes FlagsBlurMedia */
export const FlagsBlurContent = 1 << 1;
/** Label can't be self-applied */
export const FlagsNoSelf = 1 << 2;

type Label = ComAtprotoLabelDefs.Label;

export interface LabelDefinition {
	name: string;
	flags: number;
}

export const LABEL_MAPPING: Record<string, LabelDefinition> = {
	// Global "system" labels
	'!hide': {
		name: `Hidden by moderators`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	'!warn': {
		name: `Content warning`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},

	// Global user-applicable labels
	porn: {
		name: `Adult content`,
		flags: FlagsBlurMedia,
	},
	sexual: {
		name: `Sexually suggestive`,
		flags: FlagsBlurMedia,
	},
	'graphic-media': {
		name: `Graphic media`,
		flags: FlagsBlurMedia,
	},
	nudity: {
		name: `Nudity`,
		flags: FlagsBlurMedia,
	},

	// @moderation.bsky.app's labels
	'sexual-figurative': {
		name: `Sexually suggestive (cartoon)`,
		flags: FlagsBlurMedia | FlagsNoSelf,
	},

	'self-harm': {
		name: `Self-harm`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	sensitive: {
		name: `Sensitive content`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	extremist: {
		name: `Extremism`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	intolerant: {
		name: `Intolerance`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	threat: {
		name: `Threats`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	rude: {
		name: `Rude`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	illicit: {
		name: `Illicit content`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	security: {
		name: `Security risk`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	'unsafe-link': {
		name: `Unsafe link`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	impersonation: {
		name: `Impersonation`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	misinformation: {
		name: `Misinformation`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	scam: {
		name: `Scam`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	'engagement-farming': {
		name: `Engagement farming`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	spam: {
		name: `Spam`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	rumor: {
		name: `Rumor`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	misleading: {
		name: `Misleading`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
	inauthentic: {
		name: `Inauthentic`,
		flags: FlagsBlurContent | FlagsNoSelf,
	},
};

export const findLabel = (
	labels: Label[] | undefined,
	authorDid: At.Did,
	mask: number,
): LabelDefinition | undefined => {
	if (labels?.length) {
		for (let idx = 0, len = labels.length; idx < len; idx++) {
			const label = labels[idx];
			const val = label.val;

			if (!(val in LABEL_MAPPING)) {
				continue;
			}

			const def = LABEL_MAPPING[val];

			if (def.flags & FlagsNoSelf && label.src === authorDid) {
				continue;
			}

			if (def.flags & mask) {
				return def;
			}
		}
	}
};
