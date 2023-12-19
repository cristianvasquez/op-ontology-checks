import rdf from 'rdf-ext'

const ns = {
  rdf: rdf.namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  schema: rdf.namespace('http://schema.org/'),
  xsd: rdf.namespace('http://www.w3.org/2001/XMLSchema#'),
  rdfs: rdf.namespace('http://www.w3.org/2000/01/rdf-schema#'),
  ex: rdf.namespace('http://example.org/'),
  a4g: rdf.namespace('http://data.europa.eu/a4g/ontology#'),
}

export default ns
