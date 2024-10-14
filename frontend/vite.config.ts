// https://vitejs.dev/config/
// based heavily upon https://github.com/CodinGame/monaco-vscode-api/lob/main/demo/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import importMetaUrlPlugin from "@codingame/esbuild-import-meta-url-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import vsixPlugin from "@codingame/monaco-vscode-rollup-vsix-plugin";
import pkg from "./package.json" assert { type: "json" };
const localDependencies = Object.entries(pkg.dependencies)
	.filter(([, version]) => version.startsWith("file:../"))
	.map(([name]) => name);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tsconfigPaths(),
		TanStackRouterVite(),
		vsixPlugin(),
		{
			// For the *-language-features extensions which use SharedArrayBuffer
			name: "configure-response-headers",
			apply: "serve",
			configureServer: (server) => {
				server.middlewares.use((_req, res, next) => {
					res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
					res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
					res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
					next();
				});
			},
		},
	],
	esbuild: {
		minifySyntax: false,
	},
	optimizeDeps: {
		include: [
			// add all local dependencies...
			...localDependencies,
			// and their exports
			"vscode/extensions",
			"vscode/services",
			"vscode/monaco",
			"vscode/localExtensionHost",

			// These 2 lines prevent vite from reloading the whole page when starting a worker (so 2 times in a row after cleaning the vite cache - for the editor then the textmate workers)
			// it's mainly empirical and probably not the best way, fix me if you find a better way
			"vscode-textmate",
			"vscode-oniguruma",
			"@vscode/vscode-languagedetection",
			"marked",
		],
		exclude: [],
		esbuildOptions: {
			tsconfig: "./tsconfig.json",
			// @ts-ignore
			plugins: [importMetaUrlPlugin],
		},
	},
	server: {
		port: 5173,
		host: "0.0.0.0",
		fs: {
			allow: ["../"], // allow to load codicon.ttf from monaco-editor in the parent folder
		},
	},
	define: {
		rootDirectory: JSON.stringify(__dirname),
	},
	resolve: {
		dedupe: ["vscode", ...localDependencies],
	},
});
