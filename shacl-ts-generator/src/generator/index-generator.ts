import { ShapeModel } from "../parser/shacl-parser"

export class IndexGenerator {

  generateIndex(shapes: ShapeModel[]): string {

    const exports = shapes
      .map(s => `export * from "./${s.name}"`)
      .join("\n")

    return exports
  }
}