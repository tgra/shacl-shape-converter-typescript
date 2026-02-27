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
    
    const shapes = this.extractShapes(quads)
    
    this.validateShapes(shapes, validator)

    if (validator.hasErrors()) {
      validator.printAndExit()
    }

    return shapes
  }

  private extractShapes(quads: any[]): ShapeModel[] {
    const shapes: ShapeModel[] = []

    const SHACL = "http://www.w3.org/ns/shacl#"
    const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"

    const nodeShapes = quads.filter(
      q =>
        q.predicate.value === RDF_TYPE &&
        q.object.value === `${SHACL}NodeShape`
    )

    for (const shapeQuad of nodeShapes) {
      const shapeNode = shapeQuad.subject.value

      const shapeQuads = quads.filter(
        q => q.subject.value === shapeNode
      )

      const properties = this.extractProperties(quads, shapeNode)

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

      const shape: ShapeModel = {
        name: this.extractName(shapeNode),
        codeIdentifier,
        properties,
        targetClass,
        targetNode,
        targetSubjectsOf,
        targetObjectsOf
      }

      shapes.push(shape)
    }

    return shapes
  }

  private extractProperties(
    quads: any[],
    shapeNode: string
  ): ShapePropertyModel[] {

    const SHACL = "http://www.w3.org/ns/shacl#"
    const properties: ShapePropertyModel[] = []

    const propertyQuads = quads.filter(
      q =>
        q.subject.value === shapeNode &&
        q.predicate.value === `${SHACL}property`
    )

    for (const propQuad of propertyQuads) {

      const propertyNode = propQuad.object.value

      const propQuads = quads.filter(
        q => q.subject.value === propertyNode
      )

      const property: Partial<ShapePropertyModel> = {}

      for (const q of propQuads) {
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

      properties.push(property as ShapePropertyModel)
    }

    return properties
  }

  private validateShapes(
    shapes: ShapeModel[],
    validator: ValidationErrorCollector
  ) {

    for (const shape of shapes) {
      
      if (!shape.codeIdentifier) {
        validator.add(
          `Shape ${shape.name} is missing required sh:codeIdentifier`
        )
      }

      if (!shape.properties || shape.properties.length === 0) {
        validator.add(
          `Shape ${shape.name} has no property constraints`
        )
        continue
      }

      for (const prop of shape.properties) {

        if (!prop.path) {
          validator.add(
            `Property in shape ${shape.name} is missing sh:path`
          )
        }

        if (!prop.codeIdentifier) {
          validator.add(
            `Property ${prop.path ?? "[unknown path]"} in shape ${shape.name} is missing sh:codeIdentifier`
          )
        }
      }
    }
  }

  private extractName(uri: string) {
    return uri.split(/[/#]/).pop() || "Unknown"
  }
}