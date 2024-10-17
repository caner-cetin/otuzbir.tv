import React, { useState, useEffect } from "react";
import type { MonacoEditorLanguageClientWrapper } from "monaco-editor-wrapper";
import { toast } from "react-hot-toast";
import {
	PYTHON_DEFAULT_TEXT,
	PYTHON_EXT,
	TYPESCRIPT_DEFAULT_TEXT,
	TYPESCRIPT_EXT,
} from "src/editor/defaults";

interface LanguageConfig {
	extensionModule: () => Promise<any>;
	defaultText: string;
	fileExt: string;
}

export const LANGUAGE_CONFIG: Record<number, LanguageConfig> = {
	71: {
		extensionModule: () =>
			import("@codingame/monaco-vscode-python-default-extension"),
		defaultText: PYTHON_DEFAULT_TEXT,
		fileExt: PYTHON_EXT,
	},
	74: {
		extensionModule: () =>
			Promise.all([
				import("@codingame/monaco-vscode-typescript-basics-default-extension"),
				import(
					"@codingame/monaco-vscode-typescript-language-features-default-extension"
				),
			]),
		defaultText: TYPESCRIPT_DEFAULT_TEXT,
		fileExt: TYPESCRIPT_EXT,
	},
};

const loadLanguageExtension = async (languageId: number) => {
	try {
		const config = LANGUAGE_CONFIG[languageId];
		if (!config) {
			throw new Error(`No configuration found for language ID: ${languageId}`);
		}

		await config.extensionModule();
		return true;
	} catch (error) {
		console.error(
			`Failed to load extension for language ID: ${languageId}:`,
			error,
		);
		toast.error(`Failed to load language support: ${error.message}`);
		return false;
	}
};

export const useLanguageExtensionLoader = (
	languageId: number,
	editorState: MonacoEditorLanguageClientWrapper | null,
) => {
	const [loadedLanguages, setLoadedLanguages] = useState<Set<number>>(
		new Set([71]),
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!editorState || loadedLanguages.has(languageId) || isLoading) {
			return;
		}

		const loadExtension = async () => {
			setIsLoading(true);
			try {
				// Store current editor content before loading

				const success = await loadLanguageExtension(languageId);

				if (success) {
					setLoadedLanguages((prev) => new Set(prev).add(languageId));

					// Use a timeout to ensure the extension is fully loaded
					setTimeout(() => {
						const config = LANGUAGE_CONFIG[languageId];
						// Preserve user content if it exists, otherwise use default
						const newContent = config.defaultText;

						editorState.updateCodeResources({
							main: {
								text: newContent,
								fileExt: config.fileExt,
							},
						});

						setIsLoading(false);
					}, 100);
				} else {
					setIsLoading(false);
				}
			} catch (error) {
				console.error("Error during language switch:", error);
				setIsLoading(false);
				toast.error("Failed to switch language. Please try again.");
			}
		};

		loadExtension();
	}, [languageId, editorState, loadedLanguages, isLoading]);

	return {
		loadedLanguages,
		isLoading,
		currentConfig: LANGUAGE_CONFIG[languageId],
	};
};
