import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import type { WorldDish } from "./types"

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
 * Photos found for dishes that came without one: on the dish's own recipe page or its Wikipedia
 * article. Kept apart from the dish files so a rebuild of those keeps them.
 */
export type FoundImage = { image?: string; imageUrl?: string; from: string }

export function loadWorldDishes(dataDir: string = DEFAULT_DATA_DIR): WorldDish[] {
  if (cache) return cache
  const imagesFile = path.join(dataDir, "images.json")
  const found: Record<string, FoundImage> = existsSync(imagesFile)
    ? (JSON.parse(readFileSync(imagesFile, "utf8")) as Record<string, FoundImage>)
    : {}
  cache = readdirSync(dataDir)
    .filter((f) => f.endsWith(".jsonl"))
    .toSorted()
    .flatMap((f) =>
      readFileSync(path.join(dataDir, f), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const dish = JSON.parse(line) as WorldDish
          const extra = found[dish.id]
          if (dish.image || dish.imageUrl || !extra) return dish
          return {
            ...dish,
            ...(extra.image ? { image: extra.image } : {}),
            ...(extra.imageUrl ? { imageUrl: extra.imageUrl } : {}),
            imageFrom: extra.from,
          }
        }),
    )
  return cache
}
