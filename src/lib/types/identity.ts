export type Handle = `${string}.${string}`;

const HANDLE_RE =
	/^(?=.{4,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/;

export const isHandle = (input: string): input is Handle => {
	return input.length >= 3 && input.length <= 253 && HANDLE_RE.test(input);
};

export type Did<TMethod extends string = string> = `did:${TMethod}:${string}`;
export type AtprotoDid = Did<'plc' | 'web'>;

export const DID_RE = /^(?=.{7,2048}$)did:([a-z]+):([a-zA-Z0-9._:%\-]*[a-zA-Z0-9._\-])$/;

export const isDid = (input: string): input is Did => {
	return input.length >= 7 && input.length <= 2048 && DID_RE.test(input);
};
