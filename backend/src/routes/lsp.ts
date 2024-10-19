import { Server } from "bun";
import { URL } from "node:url";
import { dirname } from "node:path";
import { spawn, type SpawnOptions } from "bun";
import {
	type IWebSocket,
	WebSocketMessageReader,
	WebSocketMessageWriter,
} from "vscode-ws-jsonrpc";
import {
	createConnection,
	createServerProcess,
	forward,
} from "vscode-ws-jsonrpc/server";
import type { SpawnOptions as NodeSpawnOptions } from "node:child_process";
import {
	Message,
	InitializeRequest,
	type InitializeParams,
	type RequestMessage,
	type ResponseMessage,
} from "vscode-languageserver-protocol";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
export enum LanguageName {
	node = "node",
	java = "java",
	gopls = "gopls",
}

export interface LanguageServerRunConfig {
	serverName: string;
	pathName: string;
	runCommand: LanguageName | string;
	runCommandArgs: string[];
	spawnOptions?: SpawnOptions.OptionsObject;
	logMessages?: boolean;
	requestMessageHandler?: (message: RequestMessage) => RequestMessage;
	responseMessageHandler?: (message: ResponseMessage) => ResponseMessage;
}

const launchLanguageServer = (
	runconfig: LanguageServerRunConfig,
	socket: IWebSocket,
) => {
	const { serverName, runCommand, runCommandArgs, spawnOptions } = runconfig;
	const reader = new WebSocketMessageReader(socket);
	const writer = new WebSocketMessageWriter(socket);
	const socketConnection = createConnection(reader, writer, () =>
		socket.dispose(),
	);
	const serverConnection = createServerProcess(
		serverName,
		runCommand,
		runCommandArgs,
		spawnOptions as NodeSpawnOptions,
	);
	if (serverConnection !== undefined) {
		forward(socketConnection, serverConnection, (message) => {
			if (Message.isRequest(message)) {
				if (message.method === InitializeRequest.type.method) {
					const initializeParams = message.params as InitializeParams;
					initializeParams.processId = process.pid;
				}
				if (runconfig.requestMessageHandler !== undefined) {
					return runconfig.requestMessageHandler(message);
				}
			}
			if (Message.isResponse(message)) {
				if (runconfig.responseMessageHandler !== undefined) {
					return runconfig.responseMessageHandler(message);
				}
			}
			return message;
		});
	}
};

export const registerLanguageServer = (
	fastify: FastifyInstance,
	runconfig: LanguageServerRunConfig,
) => {
	fastify.get(
		`/lsp${runconfig.pathName}`,
		{
			websocket: true,
		},
		(webSocket: WebSocket, request: FastifyRequest) => {
			if (
				request.headers.upgrade &&
				request.headers.upgrade.toLowerCase() === "websocket"
			) {
				const socket: IWebSocket = {
					send: (content) => webSocket.send(content),
					onMessage: (cb) => webSocket.on("message", cb),
					onError: (cb) => webSocket.on("error", cb),
					onClose: (cb) => webSocket.on("close", cb),
					dispose: () => webSocket.close(),
				};

				if (webSocket.readyState === WebSocket.OPEN) {
					launchLanguageServer(runconfig, socket);
				} else {
					webSocket.on("open", () => {
						launchLanguageServer(runconfig, socket);
					});
				}
			}
		},
	);
};
export const getLocalDirectory = (referenceUrl: string | URL) => {
	const __filename = new URL(referenceUrl).pathname;
	return dirname(__filename);
};
