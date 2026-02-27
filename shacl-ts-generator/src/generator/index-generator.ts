import { ShapeModel } from "../model/shacl-model.js"

export class IndexGenerator {

  generateIndex(shapes: ShapeModel[]): string {

    const exports = shapes
      .map(s => `export * from "./${s.name}"`)
      .join("\n")

    return exports
  }
}