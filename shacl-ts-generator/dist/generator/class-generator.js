"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassGenerator = void 0;
const property_generator_1 = require("./property-generator");
class ClassGenerator {
    propertyGenerator;
    constructor(propertyGenerator = new property_generator_1.PropertyGenerator()) {
        this.propertyGenerator = propertyGenerator;
    }
    generate(shape) {
        const properties = shape.properties
            .map(p => this.propertyGenerator.generateProperty(p))
            .join("\n");
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
`;
    }
}
exports.ClassGenerator = ClassGenerator;
//# sourceMappingURL=class-generator.js.map