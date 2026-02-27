import { Parser } from "n3"
import { readFile } from "node:fs/promises"
import { ShapeModel, ShapePropertyModel } from "../model/shacl-model.js"
import { createIRI } from "../model/iri.js"
import { ValidationErrorCollector } from "../utils/validation.js"

export class ShaclParser {

  async parse(filePath: string): Promise<ShapeModel[]> {

    const ttl = await readFile(filePath, "utf-8")

    const parser = new Parser()
    const quads = parser.parse(ttl)

    const validator = new ValidationErrorCollector()

    const shapes = this.extractShapes(quads, validator)

    if (validator.hasErrors()) {
      validator.printAndExit()
    }

    return shapes
  }

  // ----------------------------------------------------
  // ⭐ Shape Extraction
  // ----------------------------------------------------

  private extractShapes(
    quads: any[],
    validator: ValidationErrorCollector
  ): ShapeModel[] {

    const shapes: ShapeModel[] = []

    const SHACL = "http://www.w3.org/ns/shacl#"
    const RDF_TYPE =
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"

    const bySubject = new Map<string, any[]>()

    for (const q of quads) {
      if (!bySubject.has(q.subject.value)) {
        bySubject.set(q.subject.value, [])
      }
      bySubject.get(q.subject.value)!.push(q)
    }

    const nodeShapes = quads.filter(
      q =>
        q.predicate.value === RDF_TYPE &&
        q.object.value === `${SHACL}NodeShape`
    )

    for (const shapeQuad of nodeShapes) {

      const shapeNode = shapeQuad.subject.value
      const shapeQuads = bySubject.get(shapeNode) || []

      const properties = this.extractProperties(
        quads,
        shapeNode,
        validator
      )

      let codeIdentifier
      let targetClass
      let targetNode
      let targetSubjectsOf
      let targetObjectsOf

      for (const q of shapeQuads) {

        switch (q.predicate.value) {

          case `${SHACL}codeIdentifier`:
            codeIdentifier = q.object.value
            break

          case `${SHACL}targetClass`:
            targetClass = createIRI(q.object.value)
            break

          case `${SHACL}targetNode`:
            targetNode = createIRI(q.object.value)
            break

          case `${SHACL}targetSubjectsOf`:
            targetSubjectsOf = createIRI(q.object.value)
            break

          case `${SHACL}targetObjectsOf`:
            targetObjectsOf = createIRI(q.object.value)
            break
        }
      }

      if (!codeIdentifier) {
        validator.add(
          `Shape ${shapeNode} is missing required sh:codeIdentifier`
        )
        continue
      }

      shapes.push({
        name: this.extractName(shapeNode),
        codeIdentifier,
        properties,
        targetClass,
        targetNode,
        targetSubjectsOf,
        targetObjectsOf
      })
    }

    return shapes
  }

  // ----------------------------------------------------
  // ⭐ Property Extraction
  // ----------------------------------------------------

  private extractProperties(
    quads: any[],
    shapeNode: string,
    validator: ValidationErrorCollector
  ): ShapePropertyModel[] {

    const SHACL = "http://www.w3.org/ns/shacl#"

    const properties: ShapePropertyModel[] = []

    const bySubject = new Map<string, any[]>()

    for (const q of quads) {
      if (!bySubject.has(q.subject.value)) {
        bySubject.set(q.subject.value, [])
      }
      bySubject.get(q.subject.value)!.push(q)
    }

    const shapeQuads = bySubject.get(shapeNode) || []

    const propertyQuads = shapeQuads.filter(
      q => q.predicate.value === `${SHACL}property`
    )

    for (const propQuad of propertyQuads) {

      const propertyNode = propQuad.object.value
      const propNodeQuads = bySubject.get(propertyNode) || []

      const property: Partial<ShapePropertyModel> = {}

      for (const q of propNodeQuads) {

        switch (q.predicate.value) {

          case `${SHACL}path`:
            property.path = createIRI(q.object.value)
            break

          case `${SHACL}codeIdentifier`:
            property.codeIdentifier = q.object.value
            break

          case `${SHACL}datatype`:
            property.datatype = createIRI(q.object.value)
            break

          case `${SHACL}class`:
            property.class = createIRI(q.object.value)
            break

          case `${SHACL}minCount`:
            property.minCount = Number(q.object.value)
            break

          case `${SHACL}maxCount`:
            property.maxCount = Number(q.object.value)
            break
        }
      }

      if (!property.path) {
        validator.add(
          `Property ${propertyNode} is missing sh:path`
        )
        continue
      }

      if (!property.codeIdentifier) {
        validator.add(
          `Property ${propertyNode} is missing sh:codeIdentifier`
        )
        continue
      }

      properties.push(property as ShapePropertyModel)
    }

    return properties
  }

  // ----------------------------------------------------
  // ⭐ Utilities
  // ----------------------------------------------------

  private extractName(uri: string) {
    return uri.split(/[/#]/).pop() || "Unknown"
  }

  private requireValue<T>(
    value: T | undefined,
    message: string
  ): T {
    if (value === undefined || value === null) {
      throw new Error(message)
    }
    return value
  }
}