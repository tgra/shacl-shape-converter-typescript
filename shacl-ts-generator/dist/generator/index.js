"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFromShacl = generateFromShacl;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const shacl_parser_1 = require("../parser/shacl-parser");
const class_generator_1 = require("./class-generator");
const naming_1 = require("../utils/naming");
async function generateFromShacl(input, output) {
    const parser = new shacl_parser_1.ShaclParser();
    const classGenerator = new class_generator_1.ClassGenerator();
    const shapes = await parser.parse(input);
    await fs_extra_1.default.ensureDir(output);
    for (const shape of shapes) {
        shape.name = naming_1.NamingUtils.toClassName(shape.name);
        const classCode = classGenerator.generate(shape);
        await fs_extra_1.default.writeFile(path_1.default.join(output, `${shape.name}.ts`), classCode);
    }
    const indexCode = shapes
        .map(s => `export * from "./${s.name}"`)
        .join("\n");
    await fs_extra_1.default.writeFile(path_1.default.join(output, "index.ts"), indexCode);
}
//# sourceMappingURL=index.js.map