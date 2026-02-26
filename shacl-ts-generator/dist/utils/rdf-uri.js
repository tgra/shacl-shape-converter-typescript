"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RdfUriUtils = void 0;
class RdfUriUtils {
    /**
     * Extract local name from RDF URI
     */
    static localName(uri) {
        if (!uri)
            return "Resource";
        const match = uri.match(/[#/](.[^#/]+)$/);
        return match ? match[1] : uri;
    }
    /**
     * Extract namespace from URI
     */
    static namespace(uri) {
        const index = Math.max(uri.lastIndexOf("#"), uri.lastIndexOf("/"));
        if (index === -1)
            return uri;
        return uri.substring(0, index + 1);
    }
    /**
     * Convert URI → safe TypeScript identifier
     */
    static toIdentifier(uri) {
        return this.localName(uri)
            .replace(/[^a-zA-Z0-9_]/g, "_");
    }
}
exports.RdfUriUtils = RdfUriUtils;
//# sourceMappingURL=rdf-uri.js.map