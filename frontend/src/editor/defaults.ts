import {
	type ConnectionConfig,
	LanguageClientConfig,
} from "monaco-editor-wrapper";
import type { LanguageClientOptions } from "vscode-languageclient/lib/common/client";
import * as vscode from "vscode";
import { MonacoLanguageClient } from "monaco-languageclient";
export interface LSPConnection {
	port: number;
	path: string;
	secured: boolean;
	host: string;
}
const BASE_PORT = Number.parseInt(import.meta.env.VITE_BACKEND_PORT);
const BASE_HOST = import.meta.env.VITE_BACKEND_URI;
export const PYTHON_DEFAULT_CLIENT_OPTS: LanguageClientOptions = {
	documentSelector: ["python", "py"],
	workspaceFolder: {
		index: 0,
		name: "workspace",
		uri: vscode.Uri.parse("/workspace"),
	},
};
export const PYTHON_LSP_CONNECTION: ConnectionConfig = {
	options: {
		$type: "WebSocketParams",
		host: BASE_HOST,
		port: BASE_PORT,
		path: "lsp/pyright",
		secured: false,
		// startOptions: {
		// 	onCall: (languageClient?: MonacoLanguageClient) => {
		// 		setTimeout(() => {
		// 			const commands = ["pyright.restartserver", "pyright.organizeimports"];
		// 			for (const cmdName of commands) {
		// 				vscode.commands.registerDiffInformationCommand(
		// 					cmdName,
		// 					(...args: unknown[]) => {
		// 						languageClient?.sendRequest("workspace/executeCommand", {
		// 							command: cmdName,
		// 							arguments: args,
		// 						});
		// 					},
		// 				);
		// 			}
		// 		}, 250);
		// 	},
		// 	reportStatus: true,
		// },
	},
};
export const PYTHON_DEFAULT_TEXT = "print('deniz abi kornaya bas')";
export const PYTHON_EXT = "py";

export const TYPESCRIPT_DEFAULT_TEXT = "console.log('deniz abi kornaya bas')";
export const TYPESCRIPT_EXT = "ts";
