import { readdirSync, readFileSync } from "node:fs"
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
export function loadWorldDishes(dataDir: string = DEFAULT_DATA_DIR): WorldDish[] {
  cache ??= readdirSync(dataDir)
    .filter((f) => f.endsWith(".jsonl"))
    .toSorted()
    .flatMap((f) =>
      readFileSync(path.join(dataDir, f), "utf8")
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as WorldDish),
    )
  return cache
}
