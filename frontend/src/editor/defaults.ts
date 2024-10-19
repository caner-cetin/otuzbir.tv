import type { ConnectionConfig } from "monaco-editor-wrapper";
import type { LanguageClientOptions } from "vscode-languageclient/lib/common/client";
import * as vscode from "vscode";
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
	},
};
export const PYTHON_DEFAULT_TEXT = "print('deniz abi kornaya bas')";
export const PYTHON_EXT = "py";
export const TYPESCRIPT_DEFAULT_TEXT = "console.log('deniz abi kornaya bas')";
export const TYPESCRIPT_EXT = "ts";

export const COBOL_DEFAULT_TEXT = `IDENTIFICATION DIVISION.
PROGRAM-ID. IDSAMPLE.
ENVIRONMENT DIVISION.
PROCEDURE DIVISION.
    DISPLAY 'DENIZ ABI KORNAYA BAS'.
    STOP RUN.
`;
export const COBOL_EXT = "CBL";

export const JAVA_DEFAULT_CLIENT_OPTS: LanguageClientOptions = {
	documentSelector: ["java"],
	workspaceFolder: {
		index: 0,
		name: "workspace",
		uri: vscode.Uri.parse("/workspace"),
	},
};
export const JAVA_LSP_CONNECTION: ConnectionConfig = {
	options: {
		$type: "WebSocketParams",
		host: BASE_HOST,
		port: BASE_PORT,
		path: "lsp/jdtls",
		secured: false,
	},
};
export const JAVA_DEFAULT_TEXT = `public class Main {
		public static void main(String[] args) {
				System.out.println("deniz abi kornaya bas");
		}
}
`;
export const JAVA_EXT = "java";
export const CPP_DEFAULT_CLIENT_OPTS: LanguageClientOptions = {
	documentSelector: ["cpp"],
	workspaceFolder: {
		index: 0,
		name: "workspace",
		uri: vscode.Uri.parse("/workspace"),
	},
};
export const CPP_LSP_CONNECTION: ConnectionConfig = {
	options: {
		$type: "WebSocketParams",
		host: BASE_HOST,
		port: BASE_PORT,
		path: "lsp/clangd",
		secured: false,
	},
};
export const CPP_DEFAULT_TEXT = `#include <iostream>
using namespace std;
int main() {
	cout << "deniz abi kornaya bas" << endl;
	return 0;
}
`;
export const CPP_EXT = "cpp";

export const C_DEFAULT_CLIENT_OPTS: LanguageClientOptions = {
	documentSelector: ["c"],
	workspaceFolder: {
		index: 0,
		name: "workspace",
		uri: vscode.Uri.parse("/workspace"),
	},
};
export const C_DEFAULT_TEXT = `#include <stdio.h>
int main() {
	printf("deniz abi kornaya bas");
	return 0;
}
`;
export const C_EXT = "c";

export const RUST_DEFAULT_CLIENT_OPTS: LanguageClientOptions = {
	documentSelector: ["rust"],
	workspaceFolder: {
		index: 0,
		name: "workspace",
		uri: vscode.Uri.parse("/workspace"),
	},
};
export const RUST_LSP_CONNECTION: ConnectionConfig = {
	options: {
		$type: "WebSocketParams",
		host: BASE_HOST,
		port: BASE_PORT,
		path: "lsp/rust-analyzer",
		secured: false,
	},
};
export const RUST_DEFAULT_TEXT = `fn main() {
	println!("deniz abi kornaya bas");
}
`;
export const RUST_EXT = "rs";
export const CARGO_TOML = `
[package]
name = "rust_playground"
version = "0.1.0"
edition = "2021"

[[bin]]
name = "main"
path = "src/main.rs"
`;

export const NASM_OPTIONS: LanguageClientOptions = {
	documentSelector: ["asm"],
	workspaceFolder: {
		index: 0,
		name: "workspace",
		uri: vscode.Uri.parse("/workspace"),
	},
};
export const NASM_LSP_CONNECTION: ConnectionConfig = {
	options: {
		$type: "WebSocketParams",
		host: BASE_HOST,
		port: BASE_PORT,
		path: "lsp/nasm",
		secured: false,
	},
};
export const NASM_DEFAULT_TEXT = `section .data
msg db '31', 0
section .text
global _start
_start:
	mov eax, 4
	mov ebx, 1
	mov ecx, msg
	mov edx, 18
	int 0x80
	mov eax, 1
	int 0x80
`;
export const NASM_EXT = "asm";
