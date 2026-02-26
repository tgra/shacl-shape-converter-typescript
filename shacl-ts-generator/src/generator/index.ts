import fs from "fs-extra"
import path from "path"

import { ShaclParser } from "../parser/shacl-parser"
import { ClassGenerator } from "./class-generator"
import { NamingUtils } from "../utils/naming"

export async function generateFromShacl(
  input: string,
  output: string
) {

  const parser = new ShaclParser()
  const classGenerator = new ClassGenerator()

  const shapes = await parser.parse(input)

  await fs.ensureDir(output)

  for (const shape of shapes) {

    shape.name = NamingUtils.toClassName(shape.name)

    const classCode = classGenerator.generate(shape)

    await fs.writeFile(
      path.join(output, `${shape.name}.ts`),
      classCode
    )
  }

  const indexCode = shapes
    .map(s => `export * from "./${s.name}"`)
    .join("\n")

  await fs.writeFile(
    path.join(output, "index.ts"),
    indexCode
  )
}