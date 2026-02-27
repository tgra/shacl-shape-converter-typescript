import { ShaclParser } from "../../src/parser/shacl-parser.js"

describe("ShaclParser internal logic", () => {

  const parser = new ShaclParser()

  test("extractName should get local name", () => {
    const name = parser["extractName"](
      "http://example.com/ns#PersonShape"
    )

    expect(name).toBe("PersonShape")
  })

})