# SHACL → TypeScript Class Generator

A Node.js + TypeScript CLI tool that transforms SHACL shape definitions into strongly typed RDFJS-compatible TypeScript resource wrappers.

The generator follows a compiler-style pipeline:

```
Parse RDF
↓
Validate Schema Constraints
↓
Normalize Models
↓
Generate TypeScript Classes
```

---

## Purpose

Given a SHACL shape file, this tool:

* Parses `sh:NodeShape` definitions using the N3 RDF parser
* Enforces generator metadata requirements
* Requires `sh:codeIdentifier` for shapes and properties
* Extracts property constraints and cardinality rules
* Generates RDFJS-compatible wrapper classes
* Reports validation errors before code generation

This enables strongly typed knowledge graph programming using TypeScript.

---

## Design Decisions

### Mutable RDFJS Property Model

Generated classes expose mutable RDF graph properties.

Properties are mapped bidirectionally:

* Getters read RDF triples and convert to JavaScript values
* Setters convert JavaScript values back into RDF terms

Example:

```ts
get name(): string | undefined
set name(value: string | undefined)
```

Benefits:

* Strong typing
* Safe term conversion
* Object-style graph mutation
* RDFJS dataset compatibility

---

### Cardinality Interpretation

| SHACL Constraint | Meaning             |
| ---------------- | ------------------- |
| sh:minCount 1    | Required property   |
| sh:maxCount 1    | Singular property   |
| sh:maxCount > 1  | Collection property |

---

### Metadata Requirements

#### Shapes

Each `sh:NodeShape` must define:

```
sh:codeIdentifier
```

Used for:

* TypeScript class name
* Deterministic generation
* API stability

Must be a valid identifier matching:

```
^[a-zA-Z_][a-zA-Z0-9_]*$
```

Specification reference: SHACL 1.2 Core Working Draft.

---

#### Properties

Each property shape must define:

```
sh:path
sh:codeIdentifier
```

Mapping:

* sh:path → RDF predicate
* sh:codeIdentifier → TypeScript field name

Missing metadata causes generation failure.

---

## Validation Strategy

Validation occurs during parsing.

If validation fails:

* All errors are reported
* CLI exits gracefully
* No partial code is generated

Required checks:

Shape level:

* sh:codeIdentifier

Property level:

* sh:path
* sh:codeIdentifier

---

## Supported SHACL Predicates

* sh:property
* sh:path
* sh:datatype
* sh:class
* sh:minCount
* sh:maxCount
* sh:targetClass
* sh:targetNode
* sh:targetSubjectsOf
* sh:targetObjectsOf
* sh:codeIdentifier

---

## Dependencies

Runtime:

```
@rdfjs/types
commander
fs-extra
n3
rdfjs-wrapper
```

Development:

```
typescript
ts-node
vitest
@types/node
```

---

## Project Structure

```
shacl-ts-generator/

src/
  cli.ts
  parser/
  generator/
  model/
  utils/
  templates/

dist/
output/
tests/
```

---

## TypeScript Configuration

```
module: NodeNext
target: ES2020
strict: true
declaration: true
sourceMap: true
```

---

## CLI Usage

Build project:

```
npm run build
```

Run CLI:

```
shacl-converter shapes.ttl output
```

Register globally:

```
npm run build
npm link
```

---

## Output

Each SHACL shape generates:

* One TypeScript wrapper class
* One index export file

Example:

```
output/
  Person.ts
  index.ts
```

---

## Testing

Uses Vitest with fixture-based SHACL inputs.

Run tests:

```
npm test
```

Test layers:

* Unit tests
* Integration tests
* CLI execution tests


---

## License

MIT
