import path from "node:path"
import { CACHE_DIR, cached, getJson, sleep } from "./http"

export type WikibooksPage = {
  pageid: number
  title: string
  revisions?: { slots: { main: { content: string } } }[]
  categories?: { title: string }[]
}
export type WikibooksResponse = {
  query?: { pages: WikibooksPage[] }
  continue?: Record<string, string>
}

/** Every page in the Cookbook's Category:Recipes, 50 at a time, with a pause between requests. */
export async function fetchWikibooks() {
  const dir = path.join(CACHE_DIR, "wikibooks")
  const params = {
    action: "query",
    format: "json",
    formatversion: "2",
    maxlag: "5",
    generator: "categorymembers",
    gcmtitle: "Category:Recipes",
    gcmnamespace: "102",
    gcmlimit: "50",
    prop: "revisions|categories",
    rvprop: "content",
    rvslots: "main",
    cllimit: "max",
  }
  let cont: Record<string, string> = {}
  for (let n = 0; ; n++) {
    const file = path.join(dir, `page-${String(n).padStart(4, "0")}.json`)
    const data = await cached<WikibooksResponse>(file, async () => {
      const result = await getJson<WikibooksResponse>(
        `https://en.wikibooks.org/w/api.php?${new URLSearchParams({ ...params, ...cont }).toString()}`,
      )
      await sleep(2000)
      return result
    })
    if (!data.continue) break
    cont = data.continue
  }
}
