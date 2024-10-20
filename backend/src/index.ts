import path, { resolve } from "node:path";
import cors from "@fastify/cors";
import { type FastifyJWT, default as fjwt, default as jwt } from "@fastify/jwt";
import { fileURLToPath } from "bun";
import fastify, {
	FastifyRegister,
	type FastifyReply,
	type FastifyRequest,
} from "fastify";
import { plugin as AllRoutes } from "./middlewares/AllRoutes";
import { v4 as uuidv4 } from "uuid";
import { ECLIPSE_JDTLS_PATH, JWT_SECRET, WORKSPACE_FOLDER } from "./config";
import { InitDB } from "./db";
import { errorHandler } from "./middlewares/Error";
import { authPlugin } from "./middlewares/JWT";
import {
	LanguageName,
	type LanguageServerRunConfig,
	getLocalDirectory,
	registerLanguageServer,
} from "./routes/lsp";
import { judgeSchemas } from "./routes/judge.schema";
import { judgeRoutes } from "./routes/judge.route";

const app = fastify({
	logger: true,
});

for (const schema of [...judgeSchemas]) {
	app.addSchema(schema);
}
await app.register(AllRoutes, {
	useColors: true,
});
await app.register(cors, {
	origin: process.env.NODE_ENV === "development" ? true : [/\cansu\.dev$/],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
	credentials: true,
});

app.register(jwt, {
	secret: JWT_SECRET,
});

app.addHook("onRequest", (request, reply, done) => {
	request.id = uuidv4();
	done();
});

app.get("/health", async (request, reply) => {
	return { status: "OK" };
});
await app.register(require("@fastify/websocket"));
await app.register(import("fastify-raw-body"), {
	field: "rawBody", // change the default request.rawBody property name
	global: false, // add the rawBody to every request. **Default true**
	encoding: "utf8", // set it to false to set rawBody as a Buffer **Default utf8**
	runFirst: false,
	jsonContentTypes: ["application/json", "text/plain"],
});
await app.register(judgeRoutes, { prefix: "/judge" });
await app.register(errorHandler);
await app.register(authPlugin);

const baseDir = resolve(getLocalDirectory(import.meta.url));
// all LSPs are registered under /lsp/*
registerLanguageServer(app, {
	serverName: "PYRIGHT",
	pathName: "/pyright",
	// bun doesnt work.
	runCommand: LanguageName.node,
	runCommandArgs: [
		resolve(baseDir, "../node_modules/.bin/pyright-langserver"),
		"--stdio",
	],
	logMessages: true,
});
registerLanguageServer(app, {
	serverName: "CLANGD",
	pathName: "/clangd",
	runCommand: "clangd",
	runCommandArgs: ["--background-index"],
	logMessages: true,
});
registerLanguageServer(app, {
	serverName: "GOPLS",
	pathName: "/gopls",
	runCommand: LanguageName.gopls,
	runCommandArgs: ["serve"],
	logMessages: true,
});
registerLanguageServer(app, {
	serverName: "NASM",
	pathName: "/nasm",
	runCommand: "asm-lsp",
	runCommandArgs: [],
	logMessages: true,
});
const start = async () => {
	try {
		await InitDB();
		await app.listen({
			port: process.env.PORT ? Number.parseInt(process.env.PORT) : 7979,
		});
		app.log.info(`Server running on ${process.env.PORT}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
