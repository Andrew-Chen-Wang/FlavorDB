import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import type { WikibooksPage, WikibooksResponse } from "../fetch/wikibooks"
import type { WorldDish } from "../types"
import { countriesForCuisine } from "./demonyms"

/** Linked Cookbook pages that are units, tools or techniques rather than ingredients. */
const NOT_INGREDIENT =
  /^(cup|cups|tablespoon|teaspoon|tbsp|tsp|pound|lb|lbs|ounce|oz|gram|g|kilogram|kg|liter|litre|ml|milliliter|millilitre|inch|cm|centimeter|quart|pint|gallon|pinch|dash|clove|slice|chopping|chop|dice|dicing|mince|mincing|slicing|julienne|grate|grating|peel|peeling|boil|boiling|simmer|simmering|saute|sauté|fry|frying|deep fry|bake|baking|roast|roasting|whisk|knead|marinate|beat|beating|blend|blender|food processor|frying pan|saucepan|pot|stock pot|wok|oven|skillet|bowl|mixing bowl|baking sheet|knife|cutting board|degree|degrees|fahrenheit|celsius|°f|°c)$/i

const COURSE =
  /^(main course|main dish|side dish|soup|stew|salad|dessert|appetizer|snack|breakfast|bread|cake|cookie|pie|pastry|sauce|condiment|beverage|drink|sandwich|dumpling|noodle|pasta|rice|curry|casserole|candy|confectionery|pickle|spread|dip) recipes$/i

function stripMarkup(text: string): string {
  return text
    .replaceAll(/<ref[^>]*\/>|<ref[^>]*>[\s\S]*?<\/ref>/g, "")
    .replaceAll(/<[^>]+>/g, "")
    .replaceAll(/\{\{[^{}]*\}\}/g, "")
    .replaceAll(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, "$1")
    .replaceAll(/\[https?:\/\/\S+\s([^\]]+)\]/g, "$1")
    .replaceAll(/'{2,}/g, "")
    .replaceAll("&nbsp;", " ")
    .replaceAll(/\s+/g, " ")
    .trim()
}

/** Lines of the first `==` section whose heading matches. */
function section(text: string, heading: RegExp): string[] {
  const lines = text.split("\n")
  const start = lines.findIndex((l) => /^=+[^=]+=+\s*$/.test(l) && heading.test(l))
  if (start === -1) return []
  const level = /^=+/.exec(lines[start])![0].length
  const out: string[] = []
  for (const line of lines.slice(start + 1)) {
    const h = /^(=+)[^=]+=+\s*$/.exec(line)
    if (h && h[1].length <= level) break
    out.push(line)
  }
  return out
}

/** The ingredient a line is about: its last link that isn't a unit, tool or technique. */
function ingredientName(line: string): string | undefined {
  const links = [...line.matchAll(/\[\[(?:Cookbook:)?([^|\]#]+)(?:\|[^\]]*)?\]\]/g)].map((m) =>
    m[1].trim(),
  )
  const candidates = links.filter(
    (l) => !NOT_INGREDIENT.test(l) && !/^(w|wikipedia|category):/i.test(l),
  )
  return candidates.at(-1)
}

function summaryField(text: string, field: string): string | undefined {
  return new RegExp(`\\|\\s*${field}\\s*=\\s*([^|\\n}]+)`, "i").exec(text)?.[1]?.trim() ?? undefined
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")

export function parseWikibooksPage(page: {
  title: string
  content: string
  categories: string[]
}): WorldDish | undefined {
  const name = page.title.replace(/^Cookbook:/, "").trim()
  const text = page.content
  if (/^#redirect/i.test(text)) return undefined

  const ingredientLines = section(text, /ingredient/i).filter((l) => l.startsWith("*"))
  const stepLines = section(
    text,
    /procedure|method|direction|preparation|instruction|steps/i,
  ).filter((l) => l.startsWith("#"))
  if (ingredientLines.length === 0 || stepLines.length === 0) return undefined

  const cuisineField = summaryField(text, "Cuisine")
  const cuisineCategories = page.categories
    .map((c) => c.replace(/^Category:/, ""))
    .filter((c) => c.endsWith(" recipes") && countriesForCuisine(c).length > 0)
    .map((c) => c.replace(/ recipes$/, ""))
  const cuisines = [...new Set([...(cuisineField ? [cuisineField] : []), ...cuisineCategories])]
  const countries = [...new Set(cuisines.flatMap(countriesForCuisine))].toSorted()
  const kinds = page.categories
    .map((c) => c.replace(/^Category:/, ""))
    .filter((c) => COURSE.test(c))
    .map((c) => c.replace(/ recipes$/i, "").toLowerCase())

  const ingredients = [
    ...new Set(ingredientLines.map(ingredientName).filter((i): i is string => !!i)),
  ]
  const intro = text
    .split(/\n==/)[0]
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        l &&
        !l.startsWith("{{") &&
        !l.startsWith("|") &&
        !l.startsWith("}}") &&
        !l.startsWith("[[Category"),
    )
    .map(stripMarkup)
    .find((l) => l.length > 40)

  const url = `https://en.wikibooks.org/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`
  const source = { name: "Wikibooks Cookbook", url, license: "CC-BY-SA-4.0" } as const
  const serves = summaryField(text, "Servings")
  return {
    id: `wikibooks:${slug(name)}`,
    name,
    names: {},
    ...(intro ? { description: intro } : {}),
    countries,
    cuisines: cuisines.map((c) => (/cuisine$/i.test(c) ? c : `${c} cuisine`)),
    kinds,
    ingredients,
    wikipedia: {},
    recipes: [
      {
        title: name,
        lang: "en",
        ...(serves ? { serves: stripMarkup(serves) } : {}),
        ingredients: ingredientLines
          .map((l) => ({ item: stripMarkup(l.replace(/^\*+/, "")) }))
          .filter((i) => i.item),
        steps: stepLines.map((l) => stripMarkup(l.replace(/^#+[*:]?/, ""))).filter(Boolean),
        source,
      },
    ],
    sources: [source],
  }
}

export function loadWikibooks(cacheDir: string): WorldDish[] {
  const dir = path.join(cacheDir, "wikibooks")
  const pages = new Map<number, { title: string; content?: string; categories: Set<string> }>()
  for (const file of readdirSync(dir).toSorted()) {
    const data = JSON.parse(readFileSync(path.join(dir, file), "utf8")) as WikibooksResponse
    for (const p of data.query?.pages ?? ([] as WikibooksPage[])) {
      const entry = pages.get(p.pageid) ?? { title: p.title, categories: new Set<string>() }
      entry.content ??= p.revisions?.[0]?.slots.main.content
      for (const c of p.categories ?? []) entry.categories.add(c.title)
      pages.set(p.pageid, entry)
    }
  }
  return [...pages.values()].flatMap((p) => {
    if (!p.content) return []
    const dish = parseWikibooksPage({
      title: p.title,
      content: p.content,
      categories: [...p.categories],
    })
    return dish ? [dish] : []
  })
}
