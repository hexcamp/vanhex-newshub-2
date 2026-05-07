import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true,
	},

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// See: https://svelte.dev/docs/kit/adapter-static
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'site/6kg6rsiaaaaa-vanhex-newsroom-1',
			// assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true,
		}),
	},
};

export default config;
