"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyGenerator = void 0;
class PropertyGenerator {
    generateProperty(prop) {
        if (prop.maxCount === 1 || !prop.maxCount) {
            return `
  get ${prop.name}(): string | undefined {
    return this.singularNullable(
      ${this.toVocabularyRef(prop.path)},
      ValueMappings.literalToString
    )
  }
`;
        }
        return `
  get ${prop.name}(): Set<string> {
    return this.objects(
      ${this.toVocabularyRef(prop.path)},
      ValueMappings.iriToString
    )
  }
`;
    }
    toVocabularyRef(iri) {
        return iri.split("/").pop();
    }
}
exports.PropertyGenerator = PropertyGenerator;
//# sourceMappingURL=property-generator.js.map