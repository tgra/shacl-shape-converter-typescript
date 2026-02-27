#!/usr/bin/env node

import { generateFromShacl } from "./generator/index.js"

const input = process.argv[2]
const output = process.argv[3]

if (!input || !output) {
  console.log("Usage:")
  console.log("node dist/cli.js <input-shacl-file> <output-folder>")
  process.exit(1)
}

generateFromShacl(input, output)