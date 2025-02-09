export const truncateMiddle = (text: string, max: number): string => {
	const len = text.length;

	if (len <= max) {
		return text;
	}

	const left = Math.ceil((max - 1) / 2);
	const right = Math.floor((max - 1) / 2);

	return text.slice(0, left) + '…' + text.slice(len - right);
};

export const truncateRight = (text: string, max: number): string => {
	if (text.length <= max) {
		return text;
	}

	return text.slice(0, max - 1) + '…';
};
