# SHACL → TypeScript Class Generator

A Node.js + TypeScript CLI tool that transforms SHACL shape files into strongly typed TypeScript RDF resource wrappers.

The generated classes follow RDFJS patterns and use `rdfjs-wrapper` for RDF term handling.

---

## Purpose

Given a SHACL shape file, this tool:

* Parses SHACL NodeShapes using the N3 RDF parser
* Extracts property constraints
* Generates TypeScript RDF resource wrapper classes
* Generates vocabulary bindings
* Supports RDFJS term mapping patterns

This allows developers to work with RDF data using strongly typed TypeScript models.

---

## Dependencies

### Runtime Dependencies

```json
{
  "@rdfjs/types": "^2.0.1",
  "commander": "^14.0.3",
  "fs-extra": "^11.3.3",
  "n3": "^2.0.1",
  "rdfjs-wrapper": "^0.28.0"
}
```

---

### Development Dependencies

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

## Architecture

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
│   │   └── index-generator.ts
│   │
│   ├── templates/
│   └── utils/
│       ├── naming.ts
│       ├── rdf-uri.ts
│       └── vocab-builder.ts
│
├── dist/
├── output/
├── tests/
├── package.json
└── tsconfig.json
```

---

## TypeScript Configuration

Your current recommended `tsconfig.json`:

```json
{
  "compilerOptions": {

    "target": "ES2022",

    "module": "CommonJS",
    "moduleResolution": "node",

    "rootDir": "src",
    "outDir": "dist",

    "strict": true,

    "esModuleInterop": true,

    "declaration": true,
    "sourceMap": true,

    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },

  "include": [
    "src/**/*"
  ],

  "exclude": [
    "node_modules",
    "output",
    "tests"
  ]
}
```

---

## How It Works

### Parse SHACL

Uses the N3 RDF parser to process SHACL Turtle files and extract:

* NodeShapes
* Target classes
* Property constraints

Supported SHACL predicates:

* sh:property
* sh:path
* sh:datatype
* sh:class
* sh:minCount
* sh:maxCount

---

### Internal Shape Model

```ts
interface ShapeModel {
  name: string
  targetClass: string
  properties: PropertyModel[]
}

interface PropertyModel {
  name: string
  path: string
  datatype?: string
  class?: string
  minCount?: number
  maxCount?: number
}
```

---

### Generate TypeScript Classes

Example generated class:

```ts
import { TermWrapper, ValueMappings, TermMappings } from "rdfjs-wrapper"

export class Person extends TermWrapper {

  get name(): string | undefined {
    return this.singularNullable(
      "http://example.com/ns#name",
      ValueMappings.literalToString
    )
  }

  get age(): number | undefined {
    return this.singularNullable(
      "http://example.com/ns#age",
      ValueMappings.literalToNumber
    )
  }
}
```

---

## CLI Usage

### Build Project

```bash
npx tsc
```

---

### Run Generator

```bash
node dist/cli.js \
  --input tests/data/shapes.ttl \
  --output output
```

---

### Development Mode

```bash
npx ts-node src/cli.ts tests/data/shapes.ttl output
```

---

## Package Distribution

Package.json configuration:

```json
{
  "type": "commonjs",
  "bin": {
    "shacl-ts": "./dist/cli.js"
  }
}
```

Install locally:

```bash
npm run build
npm link
```

Run globally:

```bash
shacl-ts --input shapes.ttl --output output
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

* TypeScript class file
* Export index file

---

## Example SHACL Input

```ttl
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://example.com/ns#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:PersonShape
    a sh:NodeShape ;
    sh:targetClass ex:Person ;

    sh:property [
        sh:path ex:name ;
        sh:datatype xsd:string ;
        sh:minCount 1 ;
    ] ;

    sh:property [
        sh:path ex:age ;
        sh:datatype xsd:integer ;
    ] .
```

---

## Development Workflow

Watch compilation:

```bash
npx tsc -w
```

Run generator:

```bash
npx ts-node src/cli.ts tests/data/shapes.ttl output
```

---

## Future Enhancements

* SHACL constraint type inference
* Required vs optional property typing
* Collection typing detection (Set<T> vs T)
* Zod schema generation
* JSON-LD context generation
* Dual build outputs (CJS + ESM)

---

## Design Goals

* Strong typing
* Deterministic code generation
* RDFJS compliance
* Solid ecosystem compatibility

---

## License

MIT

