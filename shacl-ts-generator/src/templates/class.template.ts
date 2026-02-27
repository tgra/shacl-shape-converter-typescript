export const classTemplate = (
  className: string,
  properties: string
) => `
import { TermWrapper, ValueMapping, TermMapping } from "rdfjs-wrapper"

export class ${className} extends TermWrapper {


${properties}

}
`