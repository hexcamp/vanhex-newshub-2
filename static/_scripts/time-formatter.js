// @ts-check

let startOfYear = 0;
let endOfYear = 0;

const fmtAbsoluteLong = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' });
const fmtAbsShortWithYear = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
const fmtAbsShort = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

/**
 * @param {string | number} date
 * @returns {string}
 */
const formatShortDate = (date) => {
	const inst = new Date(date);
	const time = inst.getTime();

	if (isNaN(time)) {
		return 'N/A';
	}

	const now = Date.now();
	if (now > endOfYear) {
		const date = new Date(now);

		date.setMonth(0, 1);
		date.setHours(0, 0, 0);
		startOfYear = date.getTime();

		date.setFullYear(date.getFullYear() + 1, 0, 0);
		date.setHours(23, 59, 59, 999);
		endOfYear = date.getTime();
	}

	if (time >= startOfYear && time <= endOfYear) {
		return fmtAbsShort.format(inst);
	}

	return fmtAbsShortWithYear.format(inst);
};

/**
 * @param {string | number} date
 * @returns {string}
 */
const formatLongDate = (date) => {
	const inst = new Date(date);

	if (isNaN(inst.getTime())) {
		return 'N/A';
	}

	return fmtAbsoluteLong.format(inst);
};

/** @type {Record<string, Intl.NumberFormat>} */
const relativeFormatters = {};

const SECOND = 1e3;
const NOW = SECOND * 10;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

/**
 * @param {string | number} date
 * @param {number} now
 * @returns {string}
 */
const formatRelativeTime = (date, now) => {
	const time = new Date(date).getTime();

	const delta = now - time;

	if (delta < -NOW || delta > WEEK) {
		if (now > endOfYear) {
			const date = new Date();

			date.setMonth(0, 1);
			date.setHours(0, 0, 0);
			startOfYear = date.getTime();

			date.setFullYear(date.getFullYear() + 1, 0, 0);
			date.setHours(23, 59, 59, 999);
			endOfYear = date.getTime();
		}

		// if it happened this year, don't show the year.
		if (time >= startOfYear && time <= endOfYear) {
			return fmtAbsShort.format(time);
		}

		return fmtAbsShortWithYear.format(time);
	}

	if (delta < NOW) {
		return `now`;
	}

	{
		/** @type {number} */
		let value;
		/** @type {Intl.RelativeTimeFormatUnit} */
		let unit;

		if (delta < MINUTE) {
			value = Math.floor(delta / SECOND);
			unit = 'second';
		} else if (delta < HOUR) {
			value = Math.floor(delta / MINUTE);
			unit = 'minute';
		} else if (delta < DAY) {
			value = Math.floor(delta / HOUR);
			unit = 'hour';
		} else {
			// use rounding, this handles the following scenario:
			// - 2024-02-13T09:00Z <- 2024-02-15T07:00Z = 2d
			value = Math.round(delta / DAY);
			unit = 'day';
		}

		const formatter = (relativeFormatters[unit] ||= new Intl.NumberFormat('en-US', {
			style: 'unit',
			unit: unit,
			unitDisplay: 'narrow',
		}));

		return formatter.format(Math.abs(value));
	}
};

(() => {
	/** @type {NodeListOf<HTMLTimeElement>} */
	const nodes = document.querySelectorAll('time.isl-relative-time');

	if (nodes.length === 0) {
		return;
	}

	const update = () => {
		const now = Date.now();

		for (const node of nodes) {
			const dt = node.dateTime;

			node.textContent = formatRelativeTime(dt, now);
			node.title = formatLongDate(dt);
		}
	};

	update();
	setInterval(update, 60_000);
})();

(() => {
	/** @type {NodeListOf<HTMLTimeElement>} */
	const nodes = document.querySelectorAll('time.isl-long-date');

	if (nodes.length === 0) {
		return;
	}

	for (const node of nodes) {
		node.textContent = formatLongDate(node.dateTime);
	}
})();
