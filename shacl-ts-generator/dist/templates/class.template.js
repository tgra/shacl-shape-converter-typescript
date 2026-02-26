"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classTemplate = void 0;
const classTemplate = (className, properties) => `
import { TermWrapper, ValueMappings, TermMappings } from "rdfjs-wrapper"

export class ${className} extends TermWrapper {

  get id(): string {
    return this.term.value
  }

${properties}

}
`;
exports.classTemplate = classTemplate;
//# sourceMappingURL=class.template.js.map