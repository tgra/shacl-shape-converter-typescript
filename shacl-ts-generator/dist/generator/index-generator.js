"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexGenerator = void 0;
class IndexGenerator {
    generateIndex(shapes) {
        const exports = shapes
            .map(s => `export * from "./${s.name}"`)
            .join("\n");
        return exports;
    }
}
exports.IndexGenerator = IndexGenerator;
//# sourceMappingURL=index-generator.js.map