# Ambients Protocol Compiler _(ambc)_

> Ambient Syntax `a[]` to AST `{ "id": "a", "children": [], "capabilities": [], "create": [] }`

## Table of contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
    - [Via the command line](#via-the-command-line)
    - [In code](#in-code)
- [Description](#description)
    - [Supported source languages](#supported-source-languages)
    - [Compiler steps](#compiler-steps)
    - [Intermediate abstract syntax tree format](#intermediate-abstract-syntax-tree-format)
    - [Final abstract syntax tree format](#final-abstract-syntax-tree-format)
    - [Compiler Output](#compiler-output)
- [Contributing](#contributing)
- [License](#license)

## Background

[Ambients](https://ambients.org) is a protocol for distributed computation. It allows you to request and execute computation as easily as you can data inside OrbitDB. Think of it like AWS Lambda or Azure Cloud functions, but on a decentralized peer-to-peer network.

The protocol also includes guarantees as to the verfiability and safety of the code, all without a blockchain.

## Install

```bash
$ npm install ambc -g
```

First, [install node.js](https://www.nodejs.org) Then:

```bash
$ git clone https://github.com/ambientsprotocol/ambc
$ cd ambc
$ npm install
```

## Usage

### Supported source languages

- Ambients Syntax
- [JavaScript](https://github.com/aphelionz/js2amb) (WIP)

### Via the command line


Usage for the CLI tool can be viewed by simply running `ambc`:

```bash
Compile source code to ambient syntax or JSON AST

Positionals:
  input  Path to the source code file you want to compile

Options:
  --help      Show help                                                 [boolean]
  --version   Show version number                                       [boolean]
  --display   Write output to stdout instead of the output file
                                                       [boolean] [default: false]
  --ipfs-api  Use an IPFS HTTP API by specifying a multiaddress i.e.
             "/ip4/127.0.0.1/tcp/5001"
  --format    Output format of the compiler
                           [choices: "ambient", "ir", "final"] [default: "final"]
  -o          Use to specify a custom path to the output file i.e.
              "./out/function.js"
```

### In code

You can also use `ambc` within your JavaScript code.

```JavaScript
const js2amb = require('js2amb')
const { irParser, parse } = require('ambc')

const js = '() => "hello"'

const ambientSyntax = js2amb(js)        // Outputs ambient syntax from JS
const irAst = irParser.parse(js)        // Outputs intermediate representation AST
const finalAst = parse(js)              // Outputs final AST
```

Note that to get ambient syntax from JavaScript, you will also need `js2amb`.

## Description

From the [Ambients whitepaper](https://github.com/ambientsprotocol/whitepaper/blob/master/06-compilation-model.md#translating-ambients-programs):

> The Ambients protocol overall is programming language-agnostic. That means almost any programming language can be used to write distributed programs, as long as there's a compiler that can process the source language and turn it into the Ambients bytecode. While most common programming languages can be used, due to the protocol primitives, functions and types, functional languages are especially well-suited to write distributed programs.

> Compilation model requires all compilers to:

> 1. compile original source code to an intermediate abstract syntax structure (usually as in Abstract Syntax Tree)
> 2. translate the intermediate structure to the computation primitives, distribution primitives and computation abstractions of the Ambients protocol
> 3. generate the bytecode executable from the primitives

`ambc` satisfies requirements #1 and #2 by compiling ambients syntax, and JavaScript into either an intermeidate representation or final [Abstract Syntax Tree](#intermediate-abstract-syntax-tree-format).

Both ASTs are lossless encodings, meaning that no data is lost from the ambient syntax and by-proxy the original JS code. Downstream components in the overall system can satisfy requirement #3 as required.

### Compiler steps

The compiler is very simple, and has only two primary steps, the second of which has two different types of output (IR vs final)

#### Step 1: Source code -> Ambients syntax

Compile source code from JavaScript (other languages TBD) to Ambient ASCII syntax. Users can choose to output ambient syntax by passing the `--format ambient` option to `ambc`


For example:

```JavaScript
() => "hello"
```
⬇
```text
func[
  open_|
  string[hello[]]
]|
open func
```

#### Step 2a: Ambients Syntax to intermediate representation (IR) AST

Users can choose to display an IR AST by passing the `--format ir` option to `ambc`.

```text
func[
  open_|
  string[hello[]]
]|
open func
```
⬇
```json
{ "type": "Parallel", "children": [
  { "type": "Ambient", "id": "func", "children": [
    { "type": "Parallel", "children": [
      { "type": "Open_", "id": "*" },
      { "type": "Ambient", "id": "string", "children": [
        { "type": "Noop", "id": "hello" }
      ]}
    ]},
    { "type": "Open", "id": "func" }
  ]}
]}
```

#### Step 2b: Ambients Syntax to final AST

This is the default output of the compiler, which encodes protocol primitives into the JSON.

```text
func[
  open_|
  string[hello[]]
]|
open func
```
⬇
```json
{
  "name": "",
  "children": [],
  "capabilities": [
    "in_ call",
    "open call",
    "create"
  ],
  "create": [
    {
      "name": "",
      "children": [],
      "capabilities": [
        "open return",
        "open_"
      ],
      "create": []
    }
  ]
}
```

### Intermediate abstract syntax tree format

The IR AST exceedingly and intentionally naive. It simply encodes the ambient syntax directly using a recursive structure of nodes.

Each node has three fields:

1. `type`: **Required** - the type of the ambient, a string enum which can be one of:
   - Parallel
   - Serial
   - Group
   - Ambient
   - In_
   - In
   - Out_
   - Open
   - Open_
2. `id`: _Optional_ - a string identifier
3. `children` _Optional_ - array of more child nodes

The idea here is that it is the simplest possible encoding that does not lose any of the data presented in the original ASCII syntax. Once the tree is generated it can be stored as a DAG on any compatible store. In development we simply use the in-memory structures to work with, but in practice we will likely use IPFS or IPLD.

### Final abstract syntax tree format

The final AST format encodes protocol primitives into the JSON and is more meant for machine consumption. It has the following format. Note that all fields are **required** but initialized with default blank values.

Each node in the structure has three fields:

1. `name`: The name of the ambient
2. `capabilities`: The capabilities and co-capabilitie of the ambient. Each capability has three fields:
    1. `op`: The operation to take, one of:
        - in
        - in_
        - out
        - out_
        - open
        - open_
    2. `target`: The name of the ambient the capability refers to
    3. `next`: The action to take after the capability has completed
3. `children`: array of one or more child ambients.
4. `create`: used to encode group execution, `( )` in the ambient syntax.

Parallel computation is simply encoded using arrays, and serial computation is encoded using a tree structure, using the `children` field.

### Compiler Output

If no output `-o` is specified, and the `--display` flag is not used, `ambc` will return
a [multihash](https://github.com/multiformats/multihash) from an `ipfs dag put` operation.

This hash will be used by the execution engine to run the code on a distributed, peer to peer
network.

## Contributing

Please do! Issues and PRs are very welcome.

If you're _at all_ interested in this topic you should definitely
[seek us out on Gitter](https://gitter.im/ambientsprotocol/community), open issues, and submit PRs.

To run the tests:

```bash
$ npm install
$ npm test
```

### Contribution Notes:
- `npm test` is mapped to `make test` and either command should produce identical output.
- To edit the IR parser syntax, edit the grammar at `src/ir/ambients.pegjs` and then run `make build` to build the `parser.js` file (optimized for speed) and its little buddy the `parser-tiny.js` file, optimized for size.
- To edit the final parser syntax, edit the js file at `src/parser/index.js` directly.

## License

[MIT](LICENSE) © Haja Networks Oy
