import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			runtime: "nodejs18.x",
		}),
	},

	preprocess: [
		vitePreprocess({
			typescript: {
				tsconfigFile: "./tsconfig.json",
			},
		}),
	],
};

export default config;
