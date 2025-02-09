import { createSubscriber } from 'svelte/reactivity';

const reactiveNow = (() => {
	let subscribed = false;
	let now = 0;

	const subscribe = createSubscriber((update) => {
		// updates every ~minute
		const interval = setInterval(() => {
			now = Date.now();
			update();
		}, 60_000);

		subscribed = true;
		now = Date.now();

		return () => {
			clearInterval(interval);
			subscribed = false;
		};
	});

	return () => {
		subscribe();
		return subscribed ? now : Date.now();
	};
})();

let startOfYear = 0;
let endOfYear = 0;

const fmtAbsoluteLong = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' });
const fmtAbsShortWithYear = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });
const fmtAbsShort = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export const formatShortDate = (date: string | number): string => {
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

export const formatLongDate = (date: string | number): string => {
	const inst = new Date(date);

	if (isNaN(inst.getTime())) {
		return 'N/A';
	}

	return fmtAbsoluteLong.format(inst);
};

const relativeFormatters: Record<string, Intl.NumberFormat> = {};

const SECOND = 1e3;
const NOW = SECOND * 10;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

export const formatRelativeTime = (date: string | number): string => {
	const time = new Date(date).getTime();

	const now = reactiveNow();
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
		let value: number;
		let unit: Intl.RelativeTimeFormatUnit;

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
