import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import type { Binding } from "../fetch/wikidata"
import type { WorldDish } from "../types"

const qid = (uri: string) => uri.slice(uri.lastIndexOf("/") + 1)
const isQid = (s: string) => /^Q\d+$/.test(s)

/** Items whose type says they're a brand, a business or a plant variety rather than a food people cook. */
const EXCLUDED_KIND =
  /\b(brand|company|business|trademark|cultivar|variety of|breed|restaurant|chain)\b/i

function readBatches(dir: string, prefix: string): Binding[] {
  return readdirSync(dir)
    .filter((f) => f.startsWith(prefix))
    .toSorted()
    .flatMap((f) => JSON.parse(readFileSync(path.join(dir, f), "utf8")) as Binding[])
}

const SOURCE = { name: "Wikidata", license: "CC0-1.0" } as const

export function loadWikidata(cacheDir: string): WorldDish[] {
  const dir = path.join(cacheDir, "wikidata")
  const labels = new Map<string, { en?: string; iso?: string }>()
  for (const r of readBatches(dir, "labels-")) {
    const id = qid(r.x!.value)
    const prev = labels.get(id) ?? {}
    labels.set(id, { en: prev.en ?? r.en?.value, iso: prev.iso ?? r.iso?.value })
  }
  const label = (uri: string) => labels.get(qid(uri))?.en
  const split = (b: { value: string } | undefined) =>
    b?.value ? b.value.split("|").filter(Boolean) : []

  const dishes: WorldDish[] = []
  for (const r of readBatches(dir, "batch-")) {
    const id = qid(r.d!.value)
    const en = r.enLabel?.value
    const zh = r.zhLabel?.value
    const name = en ?? zh
    if (!name || isQid(name)) continue

    const kinds = [
      ...new Set(
        split(r.types)
          .map(label)
          .filter((k): k is string => !!k && !isQid(k)),
      ),
    ]
    if (kinds.some((k) => EXCLUDED_KIND.test(k))) continue

    const countries = [
      ...new Set(
        split(r.countries)
          .map((c) => labels.get(qid(c))?.iso)
          .filter((c): c is string => !!c),
      ),
    ].toSorted()
    const cuisines = [
      ...new Set(
        split(r.cuisines)
          .map(label)
          .filter((c): c is string => !!c && !isQid(c)),
      ),
    ]
    const ingredients = [
      ...new Set(
        split(r.ingredients)
          .map(label)
          .filter((i): i is string => !!i && !isQid(i)),
      ),
    ]
    const image = r.image?.value
      ? decodeURIComponent(r.image.value.slice(r.image.value.lastIndexOf("/") + 1))
      : undefined

    const wikipedia: Record<string, string> = {}
    if (r.enWiki?.value) wikipedia.en = r.enWiki.value
    if (r.zhWiki?.value) wikipedia.zh = r.zhWiki.value
    const names: Record<string, string> = {}
    if (en && zh) names.zh = zh

    dishes.push({
      id,
      name,
      names,
      ...(r.enDesc?.value ? { description: r.enDesc.value } : {}),
      countries,
      cuisines,
      kinds,
      ingredients,
      ...(image ? { image } : {}),
      wikipedia,
      recipes: [],
      sources: [{ ...SOURCE, url: `https://www.wikidata.org/wiki/${id}` }],
    })
  }
  return dishes
}
