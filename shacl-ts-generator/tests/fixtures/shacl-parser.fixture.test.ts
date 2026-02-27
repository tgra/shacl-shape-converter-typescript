import path from "node:path"
import { ShaclParser } from "../../src/parser/shacl-parser.js"

describe("Fixture parsing", () => {

  const parser = new ShaclParser()

  test("should parse person shape", async () => {

    const file = path.join(
      process.cwd(),
      "tests/fixtures/shacl/valid/person.ttl"
    )

    const shapes = await parser.parse(file)

    expect(shapes.length).toBeGreaterThan(0)

    const person = shapes.find(
      s => s.name === "PersonShape"
    )

    expect(person?.codeIdentifier).toBe("Person")
  })

})