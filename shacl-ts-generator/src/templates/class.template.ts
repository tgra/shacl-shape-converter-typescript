export const classTemplate = (
  className: string,
  properties: string
) => `
import { TermWrapper, ValueMappings, TermMappings } from "rdfjs-wrapper"

export class ${className} extends TermWrapper {

  get id(): string {
    return this.term.value
  }

${properties}

}
`