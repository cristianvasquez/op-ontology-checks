import formats from '@rdfjs/formats'
import fs from 'fs'
import { glob } from 'glob'
import { prettyPrint } from './src/support.js'
import rdf from 'rdf-ext'

function noAuthority ({ dataset }) {
  const forbidden = 'http://publications.europa.eu/resource/authority'
  return [...dataset].filter(quad => quad.subject.value.startsWith(forbidden))
}

function doReport ({ errors }) {
  console.log(`Errors: ${errors.length}`)
  for (const current of errors) {
    console.log(JSON.stringify(current, null, 2))
  }
}

async function doChecks ({ targetDir }) {
  const turtles = await glob(`${targetDir}/**/*.ttl`, {
    stat: true, nodir: true,
  })

  const errors = []
  for (const path of turtles) {
    const fileStream = fs.createReadStream(path, 'utf-8')
    const dataset = rdf.dataset()
    try {
      await dataset.import(formats.parsers.import('text/turtle', fileStream))
    } catch (e) {
      errors.push({
        type: 'Parsing error', path, e,
      })
    }
    for (const quad of noAuthority({ dataset })) {
      errors.push({ type: 'no http://publications.europa.eu/resource/authority namespace allowed', path, offendingQuad:quad })
    }
  }

  doReport({ errors })
}

const targetDir = 'latest'

await doChecks({ targetDir })
