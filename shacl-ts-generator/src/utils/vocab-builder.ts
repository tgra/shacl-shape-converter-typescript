import fs from "fs-extra"
import path from "path"
import { RdfUriUtils } from "./rdf-uri.js"
import { NamingUtils } from "./naming.js"

export interface VocabularyTerm {
  uri: string
  prefix?: string
}

export class VocabularyBuilder {

  async generateVocabularyFile(
    terms: VocabularyTerm[],
    outputDir: string,
    fileName = "vocabulary.ts"
  ) {

    const uniqueNamespaces = new Map<string, string>()

    // Build namespace constants
    const vocabEntries = terms.map(term => {

      const ns = RdfUriUtils.namespace(term.uri)
      const localName = RdfUriUtils.localName(term.uri)

      if (!uniqueNamespaces.has(ns)) {
        uniqueNamespaces.set(
          ns,
          NamingUtils.toClassName(ns).toUpperCase()
        )
      }

      return `export const ${NamingUtils.toClassName(localName)} = "${term.uri}"`
    })

    const namespaceEntries = Array.from(uniqueNamespaces.entries())
      .map(([ns, name]) => `export const ${name}_NS = "${ns}"`)

    const fileContent = `
/**
 * Auto-generated RDF vocabulary
 */

${namespaceEntries.join("\n")}

${vocabEntries.join("\n")}
`

    await fs.ensureDir(outputDir)

    await fs.writeFile(
      path.join(outputDir, fileName),
      fileContent
    )
  }

}