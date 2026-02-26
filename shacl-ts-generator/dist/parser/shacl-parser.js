"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaclParser = void 0;
const fs = __importStar(require("fs-extra"));
const n3_1 = require("n3");
class ShaclParser {
    async parse(filePath) {
        const ttl = await fs.readFile(filePath, "utf-8");
        const parser = new n3_1.Parser();
        const quads = parser.parse(ttl);
        return this.extractShapes(quads);
    }
    extractShapes(quads) {
        const shapes = [];
        const SHACL = "http://www.w3.org/ns/shacl#";
        const nodeShapes = quads.filter(q => q.predicate.value === `${SHACL}targetClass`);
        for (const shapeQuad of nodeShapes) {
            const shapeNode = shapeQuad.subject.value;
            const targetClass = shapeQuad.object.value;
            shapes.push({
                name: this.extractName(shapeNode),
                targetClass,
                properties: []
            });
        }
        return shapes;
    }
    extractName(uri) {
        return uri.split(/[/#]/).pop() || "Unknown";
    }
}
exports.ShaclParser = ShaclParser;
//# sourceMappingURL=shacl-parser.js.map