import getEditorServiceOverride from "@codingame/monaco-vscode-editor-service-override";
import getKeybindingsServiceOverride from "@codingame/monaco-vscode-keybindings-service-override";
import getVscodeEditorServiceOverride from "@codingame/monaco-vscode-editor-service-override";
import getThemeServiceOverride from "@codingame/monaco-vscode-theme-service-override";
import getTextmateServiceOverride from "@codingame/monaco-vscode-textmate-service-override";
import getStorageServiceOverride from "@codingame/monaco-vscode-storage-service-override";
import "@codingame/monaco-vscode-python-default-extension";
import { LogLevel } from "vscode/services";
import type { WrapperConfig } from "monaco-editor-wrapper";
import { useOpenEditorStub } from "monaco-editor-wrapper/vscode/services";
import { configureMonacoWorkers } from "./configureLSPWorkers";
import {
	PYTHON_DEFAULT_CLIENT_OPTS,
	PYTHON_DEFAULT_TEXT,
	PYTHON_EXT,
	PYTHON_LSP_CONNECTION,
} from "./defaults";
export const VSConfig = (): WrapperConfig => {
	return {
		languageClientConfigs: {
			python: {
				languageId: "python",
				name: "Python LSP",
				connection: PYTHON_LSP_CONNECTION,
				clientOptions: PYTHON_DEFAULT_CLIENT_OPTS,
			},
		},
		logLevel: LogLevel.Info,
		vscodeApiConfig: {
			userServices: {
				...getKeybindingsServiceOverride(),
				...getThemeServiceOverride(),
				...getTextmateServiceOverride(),
				...getStorageServiceOverride(),
				...getEditorServiceOverride(useOpenEditorStub),
				...getVscodeEditorServiceOverride(useOpenEditorStub),
			},
			enableExtHostWorker: true,
			userConfiguration: {
				json: JSON.stringify({
					"workbench.colorTheme": "Default Dark Modern",
					"editor.guides.bracketPairsHorizontal": "active",
					"typescript.tsserver.web.projectWideIntellisense.enabled": true,
					"typescript.tsserver.web.projectWideIntellisense.suppressSemanticErrors": false,
					"editor.wordBasedSuggestions": "off",
					"editor.experimental.asyncTokenization": true,
				}),
			},
		},
		editorAppConfig: {
			$type: "extended",
			codeResources: {
				main: {
					text: PYTHON_DEFAULT_TEXT,
					fileExt: PYTHON_EXT,
				},
			},
			loadThemes: true,
			useDiffEditor: false,
			monacoWorkerFactory: configureMonacoWorkers,
			// biome-ignore lint/style/noNonNullAssertion: <what the fuck am i supposed to do>
			htmlContainer: document.getElementById("monaco-editor-root")!,
		},
	};
};
