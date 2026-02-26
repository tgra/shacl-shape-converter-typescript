import { ShapeModel } from "../parser/shacl-parser"
import { PropertyGenerator } from "./property-generator"

export class ClassGenerator {

  constructor(
    private propertyGenerator = new PropertyGenerator()
  ) {}

  generate(shape: ShapeModel): string {

    const properties = shape.properties
      .map(p => this.propertyGenerator.generateProperty(p))
      .join("\n")

    return `
import { TermWrapper } from "rdfjs-wrapper"
import { ValueMappings, TermMappings } from "rdfjs-wrapper"

export class ${shape.name} extends TermWrapper {

  get id(): string {
    return this.term.value
  }

${properties}

  override toString() {
    return this.id
  }
}
`
  }
}