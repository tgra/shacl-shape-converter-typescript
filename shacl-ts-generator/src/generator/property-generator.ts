import { ShapePropertyModel } from "../model/shacl-model.js"

export class PropertyGenerator {

  generateProperty(prop: ShapePropertyModel): string {

    if (prop.maxCount === 1 || !prop.maxCount) {

      return `
  get ${prop.codeIdentifier}(): string | undefined {
    return this.singularNullable(
      "${prop.path}",
      ValueMapping.literalToString
    )
  }
  set ${prop.codeIdentifier}(value: string | undefined) {
    this.overwriteNullable(
      "${prop.path}", value,
      TermMapping.stringToLiteral
    )
  }
`
}

    return `
  get ${prop.codeIdentifier}(): Set<string> {
    return this.objects(
      "${prop.path}",
      ValueMapping.iriToString
    )
  }
`
  }

 
}