// @ts-check

/** @type {Map<Element, (entry: ResizeObserverEntry) => void>} */
const callbacks = new Map();

const observer = new ResizeObserver((entries) => {
	for (let idx = 0, len = entries.length; idx < len; idx++) {
		const entry = entries[idx];

		const target = entry.target;
		const callback = callbacks.get(target);

		if (callback) {
			callback(entry);
		} else {
			observer.unobserve(target);
		}
	}
});

(() => {
	/** @type {NodeListOf<HTMLAnchorElement>} */
	const nodes = document.querySelectorAll('.isl-video-embed > .constrainer > .link');

	for (const anchor of nodes) {
		const parent = /** @type {HTMLDivElement} */ (anchor.parentElement);

		// listen for clicks on the anchor
		anchor.addEventListener('click', (event) => {
			event.preventDefault();

			// replace the anchor with an iframe
			const iframe = document.createElement('iframe');
			iframe.src = anchor.href;

			anchor.replaceWith(iframe);

			// observe the parent element to resize the iframe
			callbacks.set(parent, (entry) => {
				iframe.width = '' + entry.contentRect.width;
				iframe.height = '' + entry.contentRect.height;
			});

			observer.observe(parent);
		});

		// prefetch on hover
		{
			const controller = new AbortController();
			const signal = controller.signal;

			const prefetch = () => {
				const link = document.createElement('link');
				link.rel = 'prefetch';
				link.as = 'document';
				link.href = anchor.href;

				document.head.appendChild(link);

				controller.abort();
			};

			anchor.addEventListener('mouseover', prefetch, { signal });
			anchor.addEventListener('touchstart', prefetch, { signal });
		}
	}
})();
