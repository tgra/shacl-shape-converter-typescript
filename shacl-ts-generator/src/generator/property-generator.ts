import { ShapePropertyModel } from "../parser/shacl-parser"

export class PropertyGenerator {

  generateProperty(prop: ShapePropertyModel): string {

    if (prop.maxCount === 1 || !prop.maxCount) {

      return `
  get ${prop.name}(): string | undefined {
    return this.singularNullable(
      ${this.toVocabularyRef(prop.path)},
      ValueMappings.literalToString
    )
  }
`
    }

    return `
  get ${prop.name}(): Set<string> {
    return this.objects(
      ${this.toVocabularyRef(prop.path)},
      ValueMappings.iriToString
    )
  }
`
  }

  private toVocabularyRef(iri: string) {
    return iri.split("/").pop()
  }
}