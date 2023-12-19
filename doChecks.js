import formats from '@rdfjs/formats'
import fs from 'fs'
import { glob } from 'glob'
import { prettyPrint } from './src/support.js'
import rdf from 'rdf-ext'

const turtles = await glob('implementation/**/*.ttl', {
  stat: true, nodir: true,
})

const parsingErrors = []
for (const path of turtles) {
  const fileStream = fs.createReadStream(path, 'utf-8')
  try {
    const dataset = rdf.dataset()
    await dataset.import(formats.parsers.import('text/turtle', fileStream))
  } catch (e) {
    parsingErrors.push({
      path, e,
    })
  }
}

console.log(`parsing errors: ${parsingErrors.length}`)
for (const current of parsingErrors) {
  console.log(JSON.stringify(current, null, 2))
}
