// @ts-check

/**
 * @template T
 * @typedef {{ value: T }} Signal
 */

/** @type {?() => void} */
let tracking_effect = null;

/**
 * @template T
 * @param {T} value
 * @returns {Signal<T>}
 */
export const signal = (value) => {
	const listeners = new Set();

	return {
		get value() {
			if (tracking_effect) {
				listeners.add(tracking_effect);
			}

			return value;
		},
		set value(next) {
			if (next !== value) {
				value = next;
				listeners.forEach((listener) => listener());
			}
		},
	};
};

/**
 * @param {() => void} fn
 */
export const effect = (fn) => {
	const runner = () => {
		const previous_effect = tracking_effect;
		tracking_effect = runner;

		try {
			fn();
		} finally {
			tracking_effect = previous_effect;
		}
	};

	runner();
};

/**
 * @template T
 * @param {() => T} fn
 * @returns {T}
 */
export const untrack = (fn) => {
	if (tracking_effect === null) {
		return fn();
	}

	const previous_effect = tracking_effect;
	tracking_effect = null;

	try {
		return fn();
	} finally {
		tracking_effect = previous_effect;
	}
};
