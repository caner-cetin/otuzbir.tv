import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "node:path";

export default defineConfig({
	plugins: [react(), tsconfigPaths(), TanStackRouterVite()],
	resolve: {
		alias: {
			ace: path.resolve(
				__dirname,
				"node_modules/ace-builds/src-min-noconflict",
			),
		},
	},
	optimizeDeps: {
		include: ["ace-builds"],
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					ace: ["ace-builds"],
				},
			},
		},
	},
	server: {
		port: 5173,
		host: "0.0.0.0",
		fs: {
			allow: [".."],
		},
	},
});
