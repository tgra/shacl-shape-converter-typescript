"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabularyBuilder = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const rdf_uri_1 = require("./rdf-uri");
const naming_1 = require("./naming");
class VocabularyBuilder {
    async generateVocabularyFile(terms, outputDir, fileName = "vocabulary.ts") {
        const uniqueNamespaces = new Map();
        // Build namespace constants
        const vocabEntries = terms.map(term => {
            const ns = rdf_uri_1.RdfUriUtils.namespace(term.uri);
            const localName = rdf_uri_1.RdfUriUtils.localName(term.uri);
            if (!uniqueNamespaces.has(ns)) {
                uniqueNamespaces.set(ns, naming_1.NamingUtils.toClassName(ns).toUpperCase());
            }
            return `export const ${naming_1.NamingUtils.toClassName(localName)} = "${term.uri}"`;
        });
        const namespaceEntries = Array.from(uniqueNamespaces.entries())
            .map(([ns, name]) => `export const ${name}_NS = "${ns}"`);
        const fileContent = `
/**
 * Auto-generated RDF vocabulary
 */

${namespaceEntries.join("\n")}

${vocabEntries.join("\n")}
`;
        await fs_extra_1.default.ensureDir(outputDir);
        await fs_extra_1.default.writeFile(path_1.default.join(outputDir, fileName), fileContent);
    }
}
exports.VocabularyBuilder = VocabularyBuilder;
//# sourceMappingURL=vocab-builder.js.map