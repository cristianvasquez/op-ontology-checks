import { TurtleSerializer } from '@rdfjs-elements/formats-pretty'
import ns from './namespaces.js'
import getStream from 'get-stream'

function toPlain (prefixes) {
  const result = {}
  for (const [key, value] of Object.entries({ ...prefixes })) {
    result[key] = value().value
  }
  return result
}

const sink = new TurtleSerializer({
  prefixes: toPlain(ns),
})

async function prettyPrint ({ dataset }) {
  const stream = await sink.import(dataset.toStream())
  return await getStream(stream)
}

export { prettyPrint }
