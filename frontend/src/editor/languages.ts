interface LanguageConfig {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	extensionModule: () => Promise<any>;
	defaultText: string;
	mode: string;
	/**
	 * The class name of the icon to display for this language.
	 * @example
	 * ```ts
	 * <i class="devicon-visualbasic-plain"></i>
	 * ```
	 *
	 * To change the size, change the <i>'s `font-size`.
	 * @see https://devicon.dev/
	 *
	 */
	//  usage: <i class="devicon-visualbasic-plain"></i>
	//  To change the size, change the <i>'s `font-size`.
	//
	//  see https://devicon.dev/
	iconClass: string | undefined;
}
export const LANGUAGE_CONFIG: Record<number, LanguageConfig> = {
	74: {
		extensionModule: () => import("ace-builds/src-noconflict/mode-typescript"),
		defaultText: `console.log('deniz abi kornaya bas')`,
		mode: "typescript",
		iconClass: "devicon-typescript-plain",
	},
	45: {
		extensionModule: () =>
			import("ace-builds/src-noconflict/mode-assembly_x86"),
		defaultText: `section .text
global _start
_start:
    mov edx, len
    mov ecx, msg
    mov ebx, 1
    mov eax, 4
    int 0x80
    mov eax, 1
    int 0x80
section .data
msg db 'deniz abi kornaya bas', 0xa
len equ $ - msg`,
		mode: "assembly_x86",
		iconClass: "devicon-wasm-original",
	},
	46: {
		extensionModule: () => import("ace-builds/src-noconflict/mode-sh"),
		defaultText: `echo "deniz abi kornaya bas"`,
		mode: "sh",
		iconClass: "devicon-bash-plain",
	},
	47: {
		extensionModule: () => Promise.resolve(),
		defaultText: `PRINT "deniz abi kornaya bas"`,
		mode: "text",
		iconClass: "devicon-visualbasic-plain",
	},
	75: {
		// C (Clang 7.0.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-c_cpp"),
		defaultText: `#include <stdio.h>
int main() {
    printf("deniz abi kornaya bas");
    return 0;
}`,
		mode: "c_cpp",
		iconClass: "devicon-c-line",
	},
	76: {
		// C++ (Clang 7.0.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-c_cpp"),
		defaultText: `#include <iostream>
int main() {
    std::cout << "deniz abi kornaya bas";
    return 0;
}`,
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
	},
	48: {
		// C (GCC 7.4.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-c_cpp"),
		defaultText: `#include <stdio.h>
int main() {
    printf("deniz abi kornaya bas");
    return 0;
}`,
		mode: "c_cpp",
		iconClass: "devicon-c-line",
	},
	52: {
		// C++ (GCC 7.4.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-c_cpp"),
		defaultText: `#include <iostream>
int main() {
    std::cout << "deniz abi kornaya bas";
    return 0;
}`,
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
	},
	49: {
		// C (GCC 8.3.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-c_cpp"),
		defaultText: `#include <stdio.h>
int main() {
    printf("deniz abi kornaya bas");
    return 0;
}`,
		mode: "c_cpp",
		iconClass: "devicon-c-line",
	},
	53: {
		// C++ (GCC 8.3.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-c_cpp"),
		defaultText: `#include <iostream>
int main() {
    std::cout << "deniz abi kornaya bas";
    return 0;
}`,
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
	},
	50: {
		// C (GCC 9.2.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-c_cpp"),
		defaultText: `#include <stdio.h>
int main() {
    printf("deniz abi kornaya bas");
    return 0;
}`,
		mode: "c_cpp",
		iconClass: "devicon-c-line",
	},
	54: {
		// C++ (GCC 9.2.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-c_cpp"),
		defaultText: `#include <iostream>
int main() {
    std::cout << "deniz abi kornaya bas";
    return 0;
}`,
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
	},
	86: {
		// Clojure (1.10.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-clojure"),
		defaultText: `(println "deniz abi kornaya bas")`,
		mode: "clojure",
		iconClass: "devicon-clojure-line",
	},
	77: {
		// COBOL (GnuCOBOL 2.2)
		extensionModule: () => import("ace-builds/src-noconflict/mode-cobol"),
		defaultText: `IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO-WORLD.
PROCEDURE DIVISION.
    DISPLAY "deniz abi kornaya bas".
    STOP RUN.
    `,
		mode: "cobol",
		iconClass: undefined,
	},
	55: {
		// Common Lisp (SBCL 2.0.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-lisp"),
		defaultText: `(format t "deniz abi kornaya bas")`,
		mode: "lisp",
		iconClass: undefined,
	},
	56: {
		// D (DMD 2.089.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-d"),
		defaultText: `import std.stdio;
void main() {
    writeln("deniz abi kornaya bas");
}`,
		mode: "d",
		iconClass: undefined,
	},
	57: {
		// Elixir (1.9.4)
		extensionModule: () => import("ace-builds/src-noconflict/mode-elixir"),
		defaultText: `IO.puts "deniz abi kornaya bas"`,
		mode: "elixir",
		iconClass: "devicon-elixir-plain",
	},
	58: {
		// Erlang (OTP 22.2)
		extensionModule: () => import("ace-builds/src-noconflict/mode-erlang"),
		defaultText: `-module(hello).
-export([hello_world/0]).
hello_world() ->
    io:fwrite("deniz abi kornaya bas~n").`,
		mode: "erlang",
		iconClass: "devicon-erlang-plain",
	},
	87: {
		// F# (.NET Core SDK 3.1.202)
		extensionModule: () => import("ace-builds/src-noconflict/mode-fsharp"),
		defaultText: `printfn "deniz abi kornaya bas"`,
		mode: "fsharp",
		iconClass: "devicon-fsharp-plain",
	},
	59: {
		// Fortran (GFortran 9.2.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-fortran"),
		defaultText: `program hello
    print *, "deniz abi kornaya bas"
end program hello`,
		mode: "fortran",
		iconClass: "devicon-fortran-original",
	},
	60: {
		// Go (1.13.5)
		extensionModule: () => import("ace-builds/src-noconflict/mode-golang"),
		defaultText: `package main
import "fmt"
func main() {
    fmt.Println("deniz abi kornaya bas")
}`,
		mode: "golang",
		iconClass: "devicon-go-original-wordmark",
	},
	88: {
		// Groovy (3.0.3)
		extensionModule: () => import("ace-builds/src-noconflict/mode-groovy"),
		defaultText: `println "deniz abi kornaya bas"`,
		mode: "groovy",
		iconClass: "devicon-groovy-plain",
	},
	61: {
		// Haskell (GHC 8.8.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-haskell"),
		defaultText: `main = putStrLn "deniz abi kornaya bas"`,
		mode: "haskell",
		iconClass: "devicon-haskell-plain",
	},
	62: {
		// Java (OpenJDK 13.0.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-java"),
		defaultText: `public class Main {
    public static void main(String[] args) {
        System.out.println("deniz abi kornaya bas");
    }
}`,
		mode: "java",
		iconClass: "devicon-java-plain",
	},
	63: {
		// JavaScript (Node.js 12.14.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-javascript"),
		defaultText: `console.log("deniz abi kornaya bas")`,
		mode: "javascript",
		iconClass: "devicon-javascript-plain",
	},
	78: {
		// Kotlin (1.3.70)
		extensionModule: () => import("ace-builds/src-noconflict/mode-kotlin"),
		defaultText: `fun main() {
    println("deniz abi kornaya bas")
}`,
		mode: "kotlin",
		iconClass: "devicon-kotlin-plain",
	},
	64: {
		// Lua (5.3.5)
		extensionModule: () => import("ace-builds/src-noconflict/mode-lua"),
		defaultText: `print("deniz abi kornaya bas")`,
		mode: "lua",
		iconClass: "devicon-lua-plain",
	},
	// skip 89
	79: {
		// Objective-C (Clang 7.0.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-objectivec"),
		defaultText: `#import <Foundation/Foundation.h>
int main() {
    @autoreleasepool {
        NSLog(@"deniz abi kornaya bas");
    }
    return 0;
}`,
		mode: "objectivec",
		iconClass: "devicon-objectivec-plain",
	},
	65: {
		// OCaml (4.09.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-ocaml"),
		defaultText: `print_string "deniz abi kornaya bas\n"`,
		mode: "ocaml",
		iconClass: "devicon-ocaml-plain",
	},
	66: {
		// Octave (5.1.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-text"),
		defaultText: `disp("deniz abi kornaya bas")`,
		mode: "text",
		iconClass: undefined,
	},
	67: {
		// Pascal (FPC 3.0.4)
		extensionModule: () => import("ace-builds/src-noconflict/mode-pascal"),
		defaultText: `program hello;
begin
    writeln('deniz abi kornaya bas');
end.`,
		mode: "pascal",
		iconClass: undefined,
	},
	85: {
		// Perl (5.28.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-perl"),
		defaultText: `print "deniz abi kornaya bas\n"`,
		mode: "perl",
		iconClass: "devicon-perl-plain",
	},
	68: {
		// PHP (7.4.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-php"),
		defaultText: `<?php
echo "deniz abi kornaya bas";
?>`,
		mode: "php",
		iconClass: "devicon-php-plain",
	},
	69: {
		// Prolog (GNU Prolog 1.4.5)
		extensionModule: () => import("ace-builds/src-noconflict/mode-prolog"),
		defaultText: `:- initialization(main).
main :- write('deniz abi kornaya bas'), nl.`,
		mode: "prolog",
		iconClass: "devicon-prolog-plain",
	},
	70: {
		// Python (2.7.17)
		extensionModule: () => import("ace-builds/src-noconflict/mode-python"),
		defaultText: `print("deniz abi kornaya bas")`,
		mode: "python",
		iconClass: "devicon-python-plain",
	},
	71: {
		// Python (3.8.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-python"),
		defaultText: `print("deniz abi kornaya bas")`,
		mode: "python",
		iconClass: "devicon-python-plain",
	},
	80: {
		// R (4.0.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-r"),
		defaultText: `cat("deniz abi kornaya bas")`,
		mode: "r",
		iconClass: undefined,
	},
	72: {
		// Ruby (2.7.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-ruby"),
		defaultText: `puts "deniz abi kornaya bas"`,
		mode: "ruby",
		iconClass: "devicon-ruby-plain",
	},
	73: {
		// Rust (1.40.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-rust"),
		defaultText: `fn main() {
    println!("deniz abi kornaya bas");
}`,
		mode: "rust",
		iconClass: "devicon-rust-original",
	},
	81: {
		// Scala (2.13.2)
		extensionModule: () => import("ace-builds/src-noconflict/mode-scala"),
		defaultText: `object Main extends App {
    println("deniz abi kornaya bas")
}`,
		mode: "scala",
		iconClass: "devicon-scala-plain",
	},
	82: {
		// SQL (SQLite 3.27.2)
		extensionModule: () => import("ace-builds/src-noconflict/mode-sql"),
		defaultText: `SELECT "deniz abi kornaya bas"`,
		mode: "sql",
		iconClass: "devicon-sqlite-plain",
	},
	83: {
		// Swift (5.2.3)
		extensionModule: () => import("ace-builds/src-noconflict/mode-swift"),
		defaultText: `print("deniz abi kornaya bas")`,
		mode: "swift",
    iconClass: "devicon-swift-plain"
	},
	84: {
		// TypeScript (
		extensionModule: () => import("ace-builds/src-noconflict/mode-typescript"),
		defaultText: `console.log("deniz abi kornaya bas")`,
		mode: "typescript",
    iconClass: "devicon-typescript-plain"
	},
};
