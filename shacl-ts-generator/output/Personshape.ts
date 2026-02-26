
import { TermWrapper } from "rdfjs-wrapper"
import { ValueMappings, TermMappings } from "rdfjs-wrapper"

export class Personshape extends TermWrapper {

  get id(): string {
    return this.term.value
  }



  override toString() {
    return this.id
  }
}
