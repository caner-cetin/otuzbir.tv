import * as vscode from "vscode";
import getEditorServiceOverride from "@codingame/monaco-vscode-editor-service-override";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
import getVscodeEditorServiceOverride from "@codingame/monaco-vscode-editor-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getStorageServiceOverride from "@codingame/monaco-vscode-storage-service-override";
import "@codingame/monaco-vscode-python-default-extension";
import { LogLevel } from "vscode/services";
import { createUrl, type WrapperConfig } from "monaco-editor-wrapper";
import { useOpenEditorStub } from "monaco-editor-wrapper/vscode/services";
import type { MonacoLanguageClient } from "monaco-languageclient";
import {
	toSocket,
	WebSocketMessageReader,
	WebSocketMessageWriter,
} from "vscode-ws-jsonrpc";
import { configureMonacoWorkers } from "./configureLSPWorkers";

interface MonacoEditorWrapperProps {
	lspSecured: boolean;
	lspHost: string;
	lspPort: number;
	lspPath: string;
}

export const VSConfig = (
	workspaceRoot: string,
	code: string,
	codeUri: string,
	props: MonacoEditorWrapperProps,
): WrapperConfig => {
	const url = createUrl({
		secured: props.lspSecured,
		host: props.lspHost,
		port: props.lspPort,
		path: props.lspPath,
	});
	const webSocket = new WebSocket(url);
	const iWebSocket = toSocket(webSocket);
	const reader = new WebSocketMessageReader(iWebSocket);
	const writer = new WebSocketMessageWriter(iWebSocket);

	return {
		languageClientConfigs: {
			python: {
				languageId: "python",
				name: "Python Language Server Example",
				connection: {
					options: {
						$type: "WebSocketDirect",
						webSocket: webSocket,
						startOptions: {
							onCall: (languageClient?: MonacoLanguageClient) => {
								setTimeout(() => {
									// biome-ignore lint/complexity/noForEach: <explanation>
									["pyright.restartserver", "pyright.organizeimports"].forEach(
										(cmdName) => {
											vscode.commands.registerCommand(
												cmdName,
												(...args: unknown[]) => {
													languageClient?.sendRequest(
														"workspace/executeCommand",
														{ command: cmdName, arguments: args },
													);
												},
											);
										},
									);
								}, 250);
							},
							reportStatus: true,
						},
					},
					messageTransports: { reader, writer },
				},
				clientOptions: {
					documentSelector: ["python"],
					workspaceFolder: {
						index: 0,
						name: "workspace",
						uri: vscode.Uri.parse(workspaceRoot),
					},
				},
			},
		},
		logLevel: LogLevel.Debug,
		vscodeApiConfig: {
			userServices: {
				...getKeybindingsServiceOverride(),
				...getThemeServiceOverride(),
				...getTextmateServiceOverride(),
				...getStorageServiceOverride(),
				...getEditorServiceOverride(useOpenEditorStub),
				...getVscodeEditorServiceOverride(useOpenEditorStub),
			},
			userConfiguration: {
				json: JSON.stringify({
					"workbench.colorTheme": "Default Dark Modern",
					"editor.guides.bracketPairsHorizontal": "active",
					"editor.wordBasedSuggestions": "off",
					"editor.experimental.asyncTokenization": true,
				}),
			},
		},
		editorAppConfig: {
			$type: "extended",
			codeResources: {
				main: {
					text: code,
					uri: codeUri,
				},
			},
			loadThemes: true,
			useDiffEditor: false,
			monacoWorkerFactory: configureMonacoWorkers,
			htmlContainer: document.getElementById("monaco-editor-root")!,
		},
	};
};
