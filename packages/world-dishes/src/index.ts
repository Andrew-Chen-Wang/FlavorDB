import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import type { ImageCredit, WorldDish } from "./types"

export type * from "./types"

/**
 * Where the data files live when this package runs from source. Bundlers move the code (and may
 * leave `import.meta.dirname` undefined), so callers that are bundled should pass their own path.
 */
export const DEFAULT_DATA_DIR = import.meta.dirname
  ? path.join(import.meta.dirname, "..", "data")
  : path.join(process.cwd(), "packages", "world-dishes", "data")

let cache: WorldDish[] | undefined

/** Every imported dish. Reads the data files once, on first use. Server-side only. */
/**
 * Photos found for dishes that came without one, including reviewed Commons candidates. Kept
 * apart from the dish files so a rebuild of those keeps them.
 */
export type FoundImage = { image?: string; imageUrl?: string; from: string; credit?: ImageCredit }

/**
 * What each ingredient name or recipe line names on the shared ingredient list, read by people (or
 * models) rather than parsed: `{ [labels | recipe language]: { [lowercased text]: ids } }`. Wikidata
 * ingredient names are under "labels". An empty list means the text isn't an ingredient.
 */
export type IngredientMap = Record<string, Record<string, string[]>>

const readJson = <T>(file: string, fallback: T): T =>
  existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as T) : fallback

/** A dish's ingredient ids, from its ingredient names and every recipe line. */
export function ingredientIdsOf(
  dish: WorldDish,
  map: IngredientMap,
  overrides: IngredientMap = {},
): string[] {
  const ids = new Set<string>()
  for (const name of dish.ingredients)
    for (const id of overrides.labels?.[name.trim().toLowerCase()] ??
      map.labels?.[name.trim().toLowerCase()] ??
      [])
      ids.add(id)
  for (const recipe of dish.recipes)
    for (const line of recipe.ingredients)
      for (const id of overrides[recipe.lang]?.[line.item.trim().toLowerCase()] ??
        map[recipe.lang]?.[line.item.trim().toLowerCase()] ??
        [])
        ids.add(id)
  return [...ids]
}

export function loadWorldDishes(dataDir: string = DEFAULT_DATA_DIR): WorldDish[] {
  if (cache) return cache
  const found = readJson<Record<string, FoundImage>>(path.join(dataDir, "images.json"), {})
  const ingredientMap = readJson<IngredientMap>(path.join(dataDir, "ingredient-map.json"), {})
  const ingredientOverrides = readJson<Record<string, IngredientMap>>(
    path.join(dataDir, "ingredient-overrides.json"),
    {},
  )
  cache = readdirSync(dataDir)
    .filter((f) => f.endsWith(".jsonl"))
    .toSorted()
    .flatMap((f) =>
      readFileSync(path.join(dataDir, f), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const parsed = JSON.parse(line) as WorldDish
          const ingredientIds = ingredientIdsOf(
            parsed,
            ingredientMap,
            ingredientOverrides[parsed.id],
          )
          const dish = ingredientIds.length ? { ...parsed, ingredientIds } : parsed
          const extra = found[dish.id]
          if (dish.image || dish.imageUrl || !extra) return dish
          return {
            ...dish,
            ...(extra.image ? { image: extra.image } : {}),
            ...(extra.imageUrl ? { imageUrl: extra.imageUrl } : {}),
            imageFrom: extra.from,
            ...(extra.credit ? { imageCredit: extra.credit } : {}),
          }
        }),
    )
  return cache
}
