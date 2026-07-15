import { defineConfig } from 'vite';
import { copyFileSync } from 'node:fs';

export default defineConfig({
	plugins: [{
		name: 'copy-classic-script',
		closeBundle() {
			copyFileSync(new URL('./script.js', import.meta.url), new URL('./dist/script.js', import.meta.url));
		},
	}],
	base: './',
	build: {
		outDir: 'dist',
		emptyOutDir: true,
	},
});
