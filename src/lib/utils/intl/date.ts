import { dev } from '$app/environment';

const timezone = !dev ? 'UTC' : undefined;

let startOfYear = 0;
let endOfYear = 0;

const fmtTime = new Intl.DateTimeFormat('en-US', {
	timeZone: timezone,
	timeStyle: 'short',
});
const fmtDateTime = new Intl.DateTimeFormat('en-US', {
	timeZone: timezone,
	dateStyle: 'long',
	timeStyle: 'short',
});
const fmtShortDateWithYear = new Intl.DateTimeFormat('en-US', {
	timeZone: timezone,
	dateStyle: 'medium',
});
const fmtShortDate = new Intl.DateTimeFormat('en-US', {
	timeZone: timezone,
	month: 'short',
	day: 'numeric',
});

export const formatShortDate = (date: Date | string | number): string => {
	const inst = new Date(date);
	const time = inst.getTime();

	if (Number.isNaN(time)) {
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
		return fmtShortDate.format(inst);
	}

	return fmtShortDateWithYear.format(inst);
};

export const formatTime = (date: Date | string | number): string => {
	const inst = new Date(date);

	if (Number.isNaN(inst.getTime())) {
		return 'N/A';
	}

	return fmtTime.format(inst);
};

export const formatLongDate = (date: Date | string | number): string => {
	const inst = new Date(date);

	if (Number.isNaN(inst.getTime())) {
		return 'N/A';
	}

	return fmtDateTime.format(inst);
};

const relativeFormatters: Record<string, Intl.NumberFormat> = {};

const SECOND = 1e3;
const NOW = SECOND * 10;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

export const formatRelativeTime = (date: Date | string | number): string => {
	const time = new Date(date).getTime();

	const now = Date.now();
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
			return fmtShortDate.format(time);
		}

		return fmtShortDateWithYear.format(time);
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
