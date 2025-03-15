export type Handle = `${string}.${string}`;

const HANDLE_RE =
	/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z][a-zA-Z0-9-]{0,61}[a-zA-Z])$/;

export const isHandle = (input: unknown): input is Handle => {
	return typeof input === 'string' && input.length >= 3 && input.length <= 253 && HANDLE_RE.test(input);
};

export type Did<TMethod extends string = string> = `did:${TMethod}:${string}`;
export type AtprotoDid = Did<'plc' | 'web'>;

const DID_RE = /^did:([a-z]+):([a-zA-Z0-9._:%\-]*[a-zA-Z0-9._\-])$/;

export const isDid = (input: unknown): input is Did => {
	return typeof input === 'string' && input.length >= 7 && input.length <= 2048 && DID_RE.test(input);
};

const ATPROTO_WEB_DID_RE =
	/^did:web:([a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*(?:\.[a-zA-Z]{2,})|localhost(?:%3[aA]\d+)?)$/;

export const isAtprotoWebDid = (input: unknown): input is Did<'web'> => {
	return typeof input === 'string' && input.length >= 12 && ATPROTO_WEB_DID_RE.test(input);
};

const PLC_DID_RE = /^did:plc:([a-z2-7]{24})$/;

export const isPlcDid = (input: unknown): input is Did<'plc'> => {
	return typeof input === 'string' && input.length === 32 && PLC_DID_RE.test(input);
};

export const isAtprotoDid = (input: unknown): input is AtprotoDid => {
	return isPlcDid(input) || isAtprotoWebDid(input);
};
