import path from "node:path"
import { CACHE_DIR, cached, getJson, sleep } from "./http"

export type Binding = Record<string, { value: string } | undefined>

export async function sparql(query: string): Promise<Binding[]> {
  const url = `https://query.wikidata.org/sparql?${new URLSearchParams({ query }).toString()}`
  const data = await getJson<{ results: { bindings: Binding[] } }>(url, {
    Accept: "application/sparql-results+json",
  })
  return data.results.bindings
}

const qid = (uri: string) => uri.slice(uri.lastIndexOf("/") + 1)

/**
 * Every food tied to a country or a cuisine: instances of food, and dishes modelled as subclasses
 * of "dish". Two queries, because the union of both times out.
 */
const ID_QUERIES = [
  `SELECT DISTINCT ?d WHERE { ?d wdt:P31/wdt:P279* wd:Q2095 . { ?d wdt:P495 ?c } UNION { ?d wdt:P2012 ?k } }`,
  `SELECT DISTINCT ?d WHERE { ?d wdt:P279+ wd:Q746549 . { ?d wdt:P495 ?c } UNION { ?d wdt:P2012 ?k } }`,
]

const detailQuery = (ids: string[]) => `SELECT ?d
  (SAMPLE(?en) AS ?enLabel) (SAMPLE(?zh) AS ?zhLabel) (SAMPLE(?desc) AS ?enDesc)
  (GROUP_CONCAT(DISTINCT ?country; separator="|") AS ?countries)
  (GROUP_CONCAT(DISTINCT ?cuisine; separator="|") AS ?cuisines)
  (GROUP_CONCAT(DISTINCT ?ing; separator="|") AS ?ingredients)
  (GROUP_CONCAT(DISTINCT ?type; separator="|") AS ?types)
  (SAMPLE(?img) AS ?image) (SAMPLE(?enwiki) AS ?enWiki) (SAMPLE(?zhwiki) AS ?zhWiki)
  WHERE {
    VALUES ?d { ${ids.map((i) => `wd:${i}`).join(" ")} }
    OPTIONAL { ?d rdfs:label ?en FILTER(LANG(?en) = "en") }
    OPTIONAL { ?d rdfs:label ?zh FILTER(LANG(?zh) IN ("zh", "zh-hans", "zh-cn")) }
    OPTIONAL { ?d schema:description ?desc FILTER(LANG(?desc) = "en") }
    OPTIONAL { ?d wdt:P495 ?country }
    OPTIONAL { ?d wdt:P2012 ?cuisine }
    OPTIONAL { ?d wdt:P186|wdt:P527 ?ing }
    OPTIONAL { ?d wdt:P31|wdt:P279 ?type }
    OPTIONAL { ?d wdt:P18 ?img }
    OPTIONAL { ?enwiki schema:about ?d; schema:isPartOf <https://en.wikipedia.org/> }
    OPTIONAL { ?zhwiki schema:about ?d; schema:isPartOf <https://zh.wikipedia.org/> }
  } GROUP BY ?d`

/** Labels for referenced items (countries, cuisines, ingredients, types), plus ISO codes for countries. */
const labelQuery = (ids: string[]) => `SELECT ?x ?en ?iso WHERE {
  VALUES ?x { ${ids.map((i) => `wd:${i}`).join(" ")} }
  OPTIONAL { ?x rdfs:label ?en FILTER(LANG(?en) = "en") }
  OPTIONAL { ?x wdt:P297 ?iso }
}`

const BATCH = 300

export async function fetchWikidata() {
  const dir = path.join(CACHE_DIR, "wikidata")
  const ids = await cached(path.join(dir, "ids.json"), async () => {
    const found = new Set<string>()
    for (const query of ID_QUERIES) for (const r of await sparql(query)) found.add(qid(r.d!.value))
    return [...found].toSorted()
  })
  console.log(`Wikidata: ${ids.length} dishes and foods`)

  const rows: Binding[] = []
  for (let start = 0; start < ids.length; start += BATCH) {
    const file = path.join(dir, `batch-${String(start).padStart(6, "0")}.json`)
    rows.push(
      ...(await cached(file, async () => {
        const result = await sparql(detailQuery(ids.slice(start, start + BATCH)))
        await sleep(1000)
        return result
      })),
    )
  }

  const referenced = new Set<string>()
  for (const r of rows) {
    for (const key of ["countries", "cuisines", "ingredients", "types"]) {
      for (const uri of r[key]?.value.split("|") ?? []) if (uri) referenced.add(qid(uri))
    }
  }
  const refIds = [...referenced].toSorted()
  for (let start = 0; start < refIds.length; start += BATCH) {
    const file = path.join(dir, `labels-${String(start).padStart(6, "0")}.json`)
    await cached(file, async () => {
      const result = await sparql(labelQuery(refIds.slice(start, start + BATCH)))
      await sleep(1000)
      return result
    })
  }
}
