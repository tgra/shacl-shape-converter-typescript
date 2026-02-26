"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamingUtils = void 0;
class NamingUtils {
    static toClassName(uri) {
        const name = uri.split(/[/#]/).pop() || "Resource";
        return NamingUtils.pascalCase(name);
    }
    static toPropertyName(uri) {
        const name = uri.split(/[/#]/).pop() || "property";
        return NamingUtils.camelCase(name);
    }
    static pascalCase(text) {
        const words = NamingUtils.splitWords(text);
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    }
    static camelCase(text) {
        const words = NamingUtils.splitWords(text);
        return words[0].toLowerCase() +
            words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
    }
    static splitWords(text) {
        return text
            .replace(/[-_/#]/g, " ")
            .split(/\s+/)
            .filter(Boolean);
    }
}
exports.NamingUtils = NamingUtils;
//# sourceMappingURL=naming.js.map