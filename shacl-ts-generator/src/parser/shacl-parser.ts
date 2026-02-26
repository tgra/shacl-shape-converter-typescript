import * as fs from "fs-extra"
import { Parser } from "n3"

export interface ShapePropertyModel {
  name: string
  path: string
  datatype?: string
  class?: string
  minCount?: number
  maxCount?: number
}

export interface ShapeModel {
  name: string
  targetClass: string
  properties: ShapePropertyModel[]
}

export class ShaclParser {

  async parse(filePath: string): Promise<ShapeModel[]> {
    const ttl = await fs.readFile(filePath, "utf-8")

    const parser = new Parser()
    const quads = parser.parse(ttl)

    return this.extractShapes(quads)
  }

  private extractShapes(quads: any[]): ShapeModel[] {
    const shapes: ShapeModel[] = []

    const SHACL = "http://www.w3.org/ns/shacl#"

    const nodeShapes = quads.filter(
      q => q.predicate.value === `${SHACL}targetClass`
    )

    for (const shapeQuad of nodeShapes) {

      const shapeNode = shapeQuad.subject.value
      const targetClass = shapeQuad.object.value

      shapes.push({
        name: this.extractName(shapeNode),
        targetClass,
        properties: []
      })
    }

    return shapes
  }

  private extractName(uri: string) {
    return uri.split(/[/#]/).pop() || "Unknown"
  }
}