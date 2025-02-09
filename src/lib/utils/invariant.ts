export function assert(condition: any, message?: string): asserts condition {
	if (!condition) {
		if (import.meta.env.DEV) {
			throw new Error(`Assertion failed` + (message ? `: ${message}` : ``));
		}

		throw new Error(`Assertion failed`);
	}
}

export function assertNever(value: never, message?: string): never {
	assert(false, message);
}
