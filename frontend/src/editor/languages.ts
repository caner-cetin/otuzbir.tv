interface LanguageConfig {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	extensionModule: () => Promise<any>;
	defaultText: string;
	mode: string;
	runnerName?: string;
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
	iconClass: string | undefined;
}
export const LANGUAGE_CONFIG: Record<number, LanguageConfig> = {
	74: {
		extensionModule: () => {
			return Promise.all([
				require("ace-builds/src-noconflict/snippets/typescript"),
				require("ace-builds/src-noconflict/mode-typescript"),
			]);
		},
		defaultText: `console.log('deniz abi kornaya bas')`,
		runnerName: "TypeScript (3.7.4)",
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
		runnerName: "Assembly (NASM 2.14.02)",
		mode: "assembly_x86",
		iconClass: "devicon-wasm-original",
	},
	46: {
		extensionModule: () => import("ace-builds/src-noconflict/mode-sh"),
		defaultText: `echo "deniz abi kornaya bas"`,
		runnerName: "Bash (5.0.0)",
		mode: "sh",
		iconClass: "devicon-bash-plain",
	},
	47: {
		extensionModule: () => Promise.resolve(),
		defaultText: `PRINT "deniz abi kornaya bas"`,
		runnerName: "Basic (FBC 1.07.1)",
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
		runnerName: "C (Clang 7.0.1)",
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
		runnerName: "C++ (Clang 7.0.1)",
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
		runnerName: "C (GCC 7.4.0)",
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
		runnerName: "C++ (GCC 7.4.0)",
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
		runnerName: "C (GCC 8.3.0)",
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
		runnerName: "C++ (GCC 8.3.0)",
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
		runnerName: "C (GCC 9.2.0)",
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
		runnerName: "C++ (GCC 9.2.0)",
		mode: "c_cpp",
		iconClass: "devicon-cplusplus-plain",
	},
	86: {
		// Clojure (1.10.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-clojure"),
		defaultText: `(println "deniz abi kornaya bas")`,
		runnerName: "Clojure (1.10.1)",
		mode: "clojure",
		iconClass: "devicon-clojure-line",
	},
	77: {
		// COBOL (GnuCOBOL 2.2)
		extensionModule: () => import("ace-builds/src-noconflict/mode-cobol"),
		defaultText: `*> ***************************************************************
       *> Purpose:   Say hello to GNU Cobol
       *> Tectonics: cobc -x bigworld.cob
       *> ***************************************************************
       identification division.
       program-id. bigworld.

       environment division.
       configuration section.

       data division.
       working-storage section.
       01 hello                pic $$$$,$$$,$$$,$$$,$$$,$$$.99.
       01 world                pic s9(18)v99 value zero.
       01 people               pic ZZZ,ZZZ,ZZZ,ZZ9.
       01 persons              pic 9(18) value 7182044470.
       01 each                 pic 9(5)v99 value 26202.42.

       procedure division.

       multiply persons by each giving world
           on size error
             display "We did it.  We broke the world bank" 
       end-multiply.

       move world to hello
       move persons to people

       display "Hello, world".
       display " ".

       display "On " function locale-date(20130927)
               " at " function locale-time(120000)
               ", according to UN estimates:".

       display "You were home to some " people " people,"
               " with an estimated worth of " hello.

       goback.
       end program bigworld.


    `,
		runnerName: "COBOL (GnuCOBOL 2.2)",
		mode: "cobol",
		iconClass: undefined,
	},
	55: {
		// Common Lisp (SBCL 2.0.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-lisp"),
		defaultText: `(format t "deniz abi kornaya bas")`,
		runnerName: "Common Lisp (SBCL 2.0.0)",
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
		runnerName: "D (DMD 2.089.1)",
		mode: "d",
		iconClass: undefined,
	},
	57: {
		// Elixir (1.9.4)
		extensionModule: () => import("ace-builds/src-noconflict/mode-elixir"),
		defaultText: `IO.puts "deniz abi kornaya bas"`,
		runnerName: "Elixir (1.9.4)",
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
		runnerName: "Erlang (OTP 22.2)",
		mode: "erlang",
		iconClass: "devicon-erlang-plain",
	},
	87: {
		// F# (.NET Core SDK 3.1.202)
		extensionModule: () => import("ace-builds/src-noconflict/mode-fsharp"),
		defaultText: `printfn "deniz abi kornaya bas"`,
		runnerName: "F# (.NET Core SDK 3.1.202)",
		mode: "fsharp",
		iconClass: "devicon-fsharp-plain",
	},
	59: {
		// Fortran (GFortran 9.2.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-fortran"),
		defaultText: `program hello
    print *, "deniz abi kornaya bas"
end program hello`,
		runnerName: "Fortran (GFortran 9.2.0)",
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
		runnerName: "Go (1.13.5)",
		mode: "golang",
		iconClass: "devicon-go-original-wordmark",
	},
	88: {
		// Groovy (3.0.3)
		extensionModule: () => import("ace-builds/src-noconflict/mode-groovy"),
		defaultText: `println "deniz abi kornaya bas"`,
		runnerName: "Groovy (3.0.3)",
		mode: "groovy",
		iconClass: "devicon-groovy-plain",
	},
	61: {
		// Haskell (GHC 8.8.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-haskell"),
		defaultText: `-- Type annotation (optional)
fib :: Int -> Integer
 
-- With self-referencing data
fib n = fibs !! n
        where fibs = 0 : scanl (+) 1 fibs
        -- 0,1,1,2,3,5,...
 
-- Same, coded directly
fib n = fibs !! n
        where fibs = 0 : 1 : next fibs
              next (a : t@(b:_)) = (a+b) : next t
 
-- Similar idea, using zipWith
fib n = fibs !! n
        where fibs = 0 : 1 : zipWith (+) fibs (tail fibs)
 
-- Using a generator function
fib n = fibs (0,1) !! n
        where fibs (a,b) = a : fibs (b,a+b)`,
		runnerName: "Haskell (GHC 8.8.1)",
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
		runnerName: "Java (OpenJDK 13.0.1)",
		mode: "java",
		iconClass: "devicon-java-plain",
	},
	63: {
		// JavaScript (Node.js 12.14.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-javascript"),
		defaultText: `console.log("deniz abi kornaya bas")`,
		runnerName: "JavaScript (Node.js 12.14.0)",
		mode: "javascript",
		iconClass: "devicon-javascript-plain",
	},
	78: {
		// Kotlin (1.3.70)
		extensionModule: () => import("ace-builds/src-noconflict/mode-kotlin"),
		defaultText: `fun main() {
    println("deniz abi kornaya bas")
}`,
		runnerName: "Kotlin (1.3.70)",
		mode: "kotlin",
		iconClass: "devicon-kotlin-plain",
	},
	64: {
		// Lua (5.3.5)
		extensionModule: () => import("ace-builds/src-noconflict/mode-lua"),
		defaultText: `--[[--
num_args takes in 5.1 byte code and extracts the number of arguments
from its function header.
--]]--

function int(t)
	return t:byte(1)+t:byte(2)*0x100+t:byte(3)*0x10000+t:byte(4)*0x1000000
end

function num_args(func)
	local dump = string.dump(func)
	local offset, cursor = int(dump:sub(13)), offset + 26
	--Get the params and var flag (whether there's a ... in the param)
	return dump:sub(cursor):byte(), dump:sub(cursor+1):byte()
end

-- Usage:
num_args(function(a,b,c,d, ...) end) -- return 4, 7

-- Python styled string format operator
local gm = debug.getmetatable("")

gm.__mod=function(self, other)
    if type(other) ~= "table" then other = {other} end
    for i,v in ipairs(other) do other[i] = tostring(v) end
    return self:format(unpack(other))
end

print([===[
    blah blah %s, (%d %d)
]===]%{"blah", num_args(int)})

--[=[--
table.maxn is deprecated, use # instead.
--]=]--
print(table.maxn{1,2,[4]=4,[8]=8}) -- outputs 8 instead of 2

print(5 --[[ blah ]])`,
		runnerName: "Lua (5.3.5)",
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
		runnerName: "Objective-C (Clang 7.0.1)",
		mode: "objectivec",
		iconClass: "devicon-objectivec-plain",
	},
	65: {
		// OCaml (4.09.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-ocaml"),
		defaultText: `print_string "deniz abi kornaya bas\n"`,
		runnerName: "OCaml (4.09.0)",
		mode: "ocaml",
		iconClass: "devicon-ocaml-plain",
	},
	66: {
		// Octave (5.1.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-text"),
		defaultText: `disp("deniz abi kornaya bas")`,
		runnerName: "Octave (5.1.0)",
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
		runnerName: "Pascal (FPC 3.0.4)",
		mode: "pascal",
		iconClass: undefined,
	},
	85: {
		// Perl (5.28.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-perl"),
		defaultText: `print "deniz abi kornaya bas\n"`,
		runnerName: "Perl (5.28.1)",
		mode: "perl",
		iconClass: "devicon-perl-plain",
	},
	68: {
		// PHP (7.4.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-php"),
		defaultText: `<?php
echo "deniz abi kornaya bas";
?>`,
		runnerName: "PHP (7.4.1)",
		mode: "php",
		iconClass: "devicon-php-plain",
	},
	69: {
		// Prolog (GNU Prolog 1.4.5)
		extensionModule: () => import("ace-builds/src-noconflict/mode-prolog"),
		defaultText: `partition([], _, [], []).
partition([X|Xs], Pivot, Smalls, Bigs) :-
    (   X @< Pivot ->
        Smalls = [X|Rest],
        partition(Xs, Pivot, Rest, Bigs)
    ;   Bigs = [X|Rest],
        partition(Xs, Pivot, Smalls, Rest)
    ).
 
quicksort([])     --> [].
quicksort([X|Xs]) -->
    { partition(Xs, X, Smaller, Bigger) },
    quicksort(Smaller), [X], quicksort(Bigger).

perfect(N) :-
    between(1, inf, N), U is N // 2,
    findall(D, (between(1,U,D), N mod D =:= 0), Ds),
    sumlist(Ds, N).`,
		runnerName: "Prolog (GNU Prolog 1.4.5)",
		mode: "prolog",
		iconClass: "devicon-prolog-plain",
	},
	70: {
		// Python (2.7.17)
		extensionModule: () =>
			Promise.all([
				import("ace-builds/src-noconflict/mode-python"),
				import("ace-builds/src-noconflict/snippets/python"),
			]),

		defaultText: `print("deniz abi kornaya bas")`,
		runnerName: "Python (2.7.17)",
		mode: "python",
		iconClass: "devicon-python-plain",
	},
	71: {
		// Python (3.8.1)
		extensionModule: () => import("ace-builds/src-noconflict/mode-python"),
		defaultText: `print("deniz abi kornaya bas")`,
		runnerName: "Python (3.8.1)",
		mode: "python",
		iconClass: "devicon-python-plain",
	},
	80: {
		// R (4.0.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-r"),
		defaultText: `cat("deniz abi kornaya bas")`,
		runnerName: "R (4.0.0)",
		mode: "r",
		iconClass: undefined,
	},
	72: {
		// Ruby (2.7.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-ruby"),
		defaultText: `puts "deniz abi kornaya bas"`,
		runnerName: "Ruby (2.7.0)",
		mode: "ruby",
		iconClass: "devicon-ruby-plain",
	},
	73: {
		// Rust (1.40.0)
		extensionModule: () => import("ace-builds/src-noconflict/mode-rust"),
		defaultText: `fn main() {
    println!("deniz abi kornaya bas");
}`,
		runnerName: "Rust (1.40.0)",
		mode: "rust",
		iconClass: "devicon-rust-original",
	},
	81: {
		// Scala (2.13.2)
		extensionModule: () => import("ace-builds/src-noconflict/mode-scala"),
		defaultText: `object Main extends App {
    println("deniz abi kornaya bas")
}`,
		runnerName: "Scala (2.13.2)",
		mode: "scala",
		iconClass: "devicon-scala-plain",
	},
	82: {
		// SQL (SQLite 3.27.2)
		extensionModule: () => import("ace-builds/src-noconflict/mode-sql"),
		defaultText: `SELECT "deniz abi kornaya bas"`,
		runnerName: "SQL (SQLite 3.27.2)",
		mode: "sql",
		iconClass: "devicon-sqlite-plain",
	},
	83: {
		// Swift (5.2.3)
		extensionModule: () => import("ace-builds/src-noconflict/mode-swift"),
		defaultText: `print("deniz abi kornaya bas")`,
		runnerName: "Swift (5.2.3)",
		mode: "swift",
		iconClass: "devicon-swift-plain",
	},
	84: {
		// TypeScript (
		extensionModule: () => import("ace-builds/src-noconflict/mode-typescript"),
		defaultText: `console.log("deniz abi kornaya bas")`,
		runnerName: "TypeScript (3.7.4)",
		mode: "typescript",
		iconClass: "devicon-typescript-plain",
	},
};
