// Builds review batches: every dish, plus the raw source page for each recipe so a reader can check it.
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs"
import path from "node:path"
import { loadWorldDishes } from "/home/user/flavor-db/packages/world-dishes/src/index"
const cache = "/home/user/flavor-db/packages/world-dishes/.cache"
const out = process.argv[2]!
const raw = new Map<string, string>()
// English Wikibooks (API pages)
for (const f of readdirSync(path.join(cache, "wikibooks"))) {
  const data = JSON.parse(readFileSync(path.join(cache, "wikibooks", f), "utf8"))
  for (const p of data.query?.pages ?? []) {
    const c = p.revisions?.[0]?.slots.main.content
    if (c) raw.set(`https://en.wikibooks.org/wiki/${encodeURIComponent(p.title.replaceAll(" ", "_"))}`, c)
  }
}
// Other-language cookbooks (dumps)
const sites: Record<string, string> = { dewikibooks: "de", frwikibooks: "fr", eswikibooks: "es", itwikibooks: "it", zhwikibooks: "zh", jawikibooks: "ja", ptwikibooks: "pt", ruwikibooks: "ru", plwikibooks: "pl", nlwikibooks: "nl", huwikibooks: "hu" }
for (const [wiki, lang] of Object.entries(sites)) {
  for (const p of JSON.parse(readFileSync(path.join(cache, "dumps", `${wiki}.pages.json`), "utf8"))) {
    raw.set(`https://${lang}.wikibooks.org/wiki/${encodeURIComponent(p.title.replaceAll(" ", "_"))}`, p.text)
  }
}
// HowToCook
const walk = (d: string): string[] => readdirSync(d).flatMap((n) => { const f = path.join(d, n); return statSync(f).isDirectory() ? walk(f) : f.endsWith(".md") ? [f] : [] })
const root = path.join(cache, "howtocook", "dishes")
for (const f of walk(root)) raw.set(`https://github.com/Anduin2017/HowToCook/blob/master/dishes/${path.relative(root, f)}`, readFileSync(f, "utf8"))

const dishes = loadWorldDishes()
let missing = 0
const toRecord = (d: (typeof dishes)[number]) => ({
  id: d.id, name: d.name, names: d.names, description: d.description, countries: d.countries, cuisines: d.cuisines, kinds: d.kinds, ingredients: d.ingredients,
  wikipedia: Object.keys(d.wikipedia),
  recipes: d.recipes.map((r) => {
    const src = raw.get(r.source.url)
    if (!src) missing++
    return { lang: r.lang, title: r.title, source: r.source.url, ingredients: r.ingredients.map((i) => (i.amount ? `${i.amount} ${i.item}` : i.item)), steps: r.steps, raw_source: src ? src.slice(0, 6000) : "(not available)" }
  }),
})
const withRecipes = dishes.filter((d) => d.recipes.length)
const without = dishes.filter((d) => !d.recipes.length)
let n = 0
const write = (list: typeof dishes, size: number, prefix: string) => {
  for (let i = 0; i < list.length; i += size) {
    writeFileSync(path.join(out, `${prefix}-${String(n++).padStart(3, "0")}.jsonl`), list.slice(i, i + size).map((d) => JSON.stringify(toRecord(d))).join("\n") + "\n")
  }
}
write(without, 300, "names")
write(withRecipes, 60, "recipes")
console.log({ dishes: dishes.length, withRecipes: withRecipes.length, without: without.length, batches: n, missingRaw: missing })
