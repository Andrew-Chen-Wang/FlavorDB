import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import type { WorldDish } from "./types"

export type * from "./types"

/** Where the data files live when this package runs from source. Bundlers move code, so callers can pass their own. */
export const DEFAULT_DATA_DIR = path.join(import.meta.dirname, "..", "data")

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
