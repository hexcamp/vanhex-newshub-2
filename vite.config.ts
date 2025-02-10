import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
	return {
		build: {
			target: 'es2024',
		},
		esbuild: {
			target: 'es2024',
		},
		plugins: [
			sveltekit(),

			// Nasty hack to remove the hydration markers that SvelteKit adds to the HTML
			command === 'build' && {
				name: 'remove-hydration-markers',
				transform(code, id, options) {
					if (id.endsWith('.svelte') && code.includes('$$payload')) {
						code = code
							.replace(/<!--.*?-->/g, '')
							.replace(/\$\$slots: {.+?},?/g, '')
							.replace(/\$\$payload\.out \+= ["`]{2};|\$\.(push|pop)\(\);/g, '')
							.replace(/(?<=\$\$payload\.out \+= )`\${([a-zA-Z0-9_$.,()[\]\s]+?)}`(?=;)/, '$1');

						return code;
					} else if (id.includes('node_modules/svelte/') && code.includes('<!--')) {
						code = code.replace(/<!--.*?-->/g, '');

						return code;
					}
				},
			},
		],
	};
});
