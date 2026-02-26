#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./generator/index");
const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) {
    console.log("Usage:");
    console.log("node dist/cli.js <input-shacl-file> <output-folder>");
    process.exit(1);
}
(0, index_1.generateFromShacl)(input, output);
//# sourceMappingURL=cli.js.map