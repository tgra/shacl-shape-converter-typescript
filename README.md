# SHACL → TypeScript Class Generator

A Node.js + TypeScript CLI tool that transforms SHACL shape definitions into strongly typed TypeScript RDF resource wrappers.

The generator enforces SHACL metadata requirements and produces RDFJS-compatible class models.

---

## Purpose

Given a SHACL shape file, this tool:

* Parses `sh:NodeShape` definitions using the N3 RDF parser
* Validates required generator metadata
* Requires `sh:codeIdentifier` for shapes and properties
* Extracts property constraints
* Generates TypeScript RDF resource wrapper classes
* Generates vocabulary bindings
* Fails fast with structured validation reporting

This enables strongly typed, RDFJS-compatible TypeScript models derived directly from SHACL.

---

## Design decisions

1. ### Treats all properties as read/write (mutable) by default



2. ### `sh:codeIdentifier` Requirement

This generator requires:

```
sh:codeIdentifier
```

#### Specification Status

`sh:codeIdentifier` is defined in the **SHACL 1.2 Core Working Draft**:

[https://www.w3.org/TR/shacl12-core/#codeIdentifier](https://www.w3.org/TR/shacl12-core/#codeIdentifier)

From the specification:

> Shapes may have one value for `sh:codeIdentifier` to suggest a name that can be used for a representation of the shape in APIs, query languages and similar programmatic access.

The value:

* Must be a literal
* Must be `xsd:string`
* Must match: `^[a-zA-Z_][a-zA-Z0-9_]*$`

#### How This Generator Uses It

* For shapes → TypeScript class name
* For properties → TypeScript field name
* Ensures deterministic code generation

It must expand to:
```
http://www.w3.org/ns/shacl#codeIdentifier
```

Correct usage:

```ttl
sh:codeIdentifier "Person" ;
```


 3. ### Exclude SHACL Validation Features 

Constraints such as:

* `sh:pattern`
* `sh:maxLength`
* `sh:datatype`
* `sh:class`

are not used during generation.



4. ### Interpret Cardinality

| SHACL Constraint | Interpretation                |
| ---------------- | ----------------------------- |
| `sh:minCount 1`  | Required property             |
| `sh:maxCount 1`  | Singular (non-array) property |

---




## Validation Rules

The generator enforces deterministic metadata requirements.

If validation fails:

* All validation errors are reported
* The CLI exits gracefully
* No partial code is generated

### Required Shape Metadata

Each `sh:NodeShape` must define:

```
sh:codeIdentifier
```

Used as:

* TypeScript class name
* Stable API identifier
* Deterministic generation key

### Required Property Metadata

Each property shape must define:

```
sh:path
sh:codeIdentifier
```

Where:

* `sh:path` → RDF predicate mapping
* `sh:codeIdentifier` → TypeScript field name

If missing, generation fails.

---

## Dependencies

### Runtime

```json
{
  "@rdfjs/types": "^2.0.1",
  "commander": "^14.0.3",
  "fs-extra": "^11.3.3",
  "n3": "^2.0.1",
  "rdfjs-wrapper": "^0.28.0"
}
```

### Development

```json
{
  "@types/fs-extra": "^11.0.4",
  "@types/n3": "^1.26.1",
  "@types/node": "^25.3.1",
  "ts-node": "^10.9.2",
  "typescript": "^5.9.3"
}
```

---

## Project Structure

```
shacl-ts-generator/
│
├── src/
│   ├── cli.ts
│   ├── parser/
│   │   └── shacl-parser.ts
│   ├── generator/
│   │   ├── class-generator.ts
│   │   ├── property-generator.ts
│   │   ├── index.ts   
│   │   └── index-generator.ts
│   ├── model/
│   │   ├── shacl-model.ts
│   │   └── iri.ts
│   ├── templates/
│   │   └── class.template.ts
│   └── utils/
│       ├── naming.ts
│       ├── rdf-uri.ts
|       ├── vocab-builder.ts
│       └── validation.ts
│
├── dist/
├── output/
├── tests/
├── package.json
├── vitest.config.ts
└── tsconfig.json
```

---

## TypeScript Configuration

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2020",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "declaration": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "output", "tests"]
}
```

---

## How It Works

### 1. Parse SHACL

Uses the N3 RDF parser to extract:

* NodeShapes
* Target constraints
* Property constraints

Supported predicates:

* `sh:property`
* `sh:path`
* `sh:datatype`
* `sh:class`
* `sh:minCount`
* `sh:maxCount`
* `sh:targetClass`
* `sh:targetNode`
* `sh:targetSubjectsOf`
* `sh:targetObjectsOf`
* `sh:codeIdentifier`

---

### 2. Internal Shape Model

```ts
interface ShapeModel {
  name: string
  codeIdentifier: string
  properties: PropertyModel[]

  targetClass?: string
  targetNode?: string
  targetSubjectsOf?: string
  targetObjectsOf?: string
}

interface PropertyModel {
  codeIdentifier: string
  path: string

  datatype?: string
  class?: string
  minCount?: number
  maxCount?: number
}
```

---

### 3. Generate TypeScript Classes

Example output:

```ts
import { TermWrapper, ValueMapping } from "rdfjs-wrapper"

export class Person extends TermWrapper {

  get name(): string | undefined {
    return this.singularNullable(
      "http://example.com/ns#name",
      ValueMapping.literalToString
    )
  }

  get age(): number | undefined {
    return this.singularNullable(
      "http://example.com/ns#age",
      ValueMapping.literalToNumber
    )
  }
}
```

---

## CLI Usage

### Build the Project

```bash
npm run build
```

Compiles TypeScript from `src/` into `dist/`.
You must run this before executing the CLI from `dist/`.

---

### Register CLI Globally (Optional)

Your package exposes:

```json
"bin": {
  "shacl-converter": "./dist/cli.js"
}
```

To use the CLI globally during development:

```bash
npm run build
npm link
```

This creates a global symlink so you can run:

```bash
shacl-converter tests/data/shapes.ttl output
```

from anywhere on your machine.

If you modify source files, re-run:

```bash
npm run build
```

You do not need to re-run `npm link` unless the `bin` configuration changes.

---

### Run Without Linking

After building:

```bash
node dist/cli.js tests/data/shapes.ttl output
```

---

### Development Mode (No Build Step)

```bash
npx ts-node src/cli.ts tests/data/shapes.ttl output
```

---

## Output Structure

```
output/
├── Person.ts
├── Meeting.ts
└── index.ts
```

Each SHACL shape generates:

* One TypeScript class file
* A barrel export file

---

## Example SHACL Input

```ttl
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://example.com/ns#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:PersonShape
    a sh:NodeShape ;
    sh:codeIdentifier "Person" ;
    sh:targetClass ex:Person ;

    sh:property [
        sh:path ex:name ;
        sh:codeIdentifier "name" ;
        sh:datatype xsd:string ;
        sh:minCount 1 ;
    ] ;

    sh:property [
        sh:path ex:age ;
        sh:codeIdentifier "age" ;
        sh:datatype xsd:integer ;
    ] .
```

---



## Tests

This project uses a multi-layer testing strategy to ensure reliable SHACL parsing, validation, and code generation.

Tests are divided into:

* **Unit tests** – Validate individual parser and utility functions in isolation.
* **Integration tests** – Test the full pipeline from SHACL TTL input through RDF parsing and model generation.
* **Fixture tests** – Use predefined SHACL documents to guarantee deterministic parsing behavior.
* **CLI tests** – Verify real command-line execution, including argument handling and file generation.

Run the test suite with:

```bash
npm test
```

Tests are implemented using **Vitest** with fixture-based inputs for consistency and reliability.




---

## License

MIT
