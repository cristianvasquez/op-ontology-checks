import formats from "@rdfjs/formats";
import fs from "fs";
import { glob } from "glob";
import { prettyPrint } from "./src/support.js";
import rdf from "rdf-ext";

function authorityTableFilter(quad) {
  return quad.subject.value.startsWith(
    "http://publications.europa.eu/resource/authority"
  );
}

function doReport({ errors }) {
  console.log(`Errors: ${errors.length}`);
  for (const current of errors) {
    console.log(JSON.stringify(current, null, 2));
  }
}

async function doChecks({ targetDir }) {
  const turtles = await glob(`${targetDir}/**/*.ttl`, {
    stat: true,
    nodir: true,
  });

  const errors = [];
  for (const path of turtles) {
    const fileStream = fs.createReadStream(path, "utf-8");
    const dataset = rdf.dataset();
    try {
      await dataset.import(formats.parsers.import("text/turtle", fileStream));
    } catch (e) {
      errors.push({
        type: "Parsing error",
        severity: "Fatal",
        path,
        e,
      });
    }

    for (const quad of [...dataset].filter(authorityTableFilter)) {
      errors.push({
        type: "no http://publications.europa.eu/resource/authority namespace allowed",
        severity: "Error",
        path,
        offendingQuad: quad,
      });
    }
  }

  doReport({ errors });
}

const targetDir = "latest";

await doChecks({ targetDir });
