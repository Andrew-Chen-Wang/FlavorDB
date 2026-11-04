import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

/** Identifies the importer to the sites it reads, as Wikimedia's API policy asks. */
export const USER_AGENT = "FlavorDB-importer/0.1 (https://github.com/Andrew-Chen-Wang/flavor-db)"

export const CACHE_DIR = path.join(import.meta.dirname, "..", "..", ".cache")

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** GET JSON with retries and backoff. */
export async function getJson<T>(
  url: string,
  headers: Record<string, string> = {},
  tries = 8,
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, ...headers } })
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`)
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
      return (await res.json()) as T
    } catch (error) {
      lastError = error
      console.warn(`retry ${attempt + 1}: ${String(error)}`)
      await sleep(5000 * (attempt + 1))
    }
  }
  throw lastError
}

/** Runs `produce` only when `file` isn't cached yet, so an interrupted fetch can resume. */
export async function cached<T>(file: string, produce: () => Promise<T>): Promise<T> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T
  } catch {
    const value = await produce()
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, JSON.stringify(value))
    return value
  }
}
