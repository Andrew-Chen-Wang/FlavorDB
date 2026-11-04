import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { createInterface } from "node:readline"
import { CACHE_DIR, USER_AGENT } from "./http"

/** Cookbooks in other Wikibooks languages, and the title prefix their recipe pages live under. */
export const COOKBOOKS = [
  { wiki: "dewikibooks", lang: "de", prefix: "Kochbuch/" },
  { wiki: "frwikibooks", lang: "fr", prefix: "Livre de cuisine/" },
  { wiki: "eswikibooks", lang: "es", prefix: "Artes culinarias/Recetas/" },
  { wiki: "itwikibooks", lang: "it", prefix: "Libro di cucina/" },
  { wiki: "zhwikibooks", lang: "zh", prefix: "食谱/" },
  { wiki: "jawikibooks", lang: "ja", prefix: "料理本/" },
  { wiki: "ptwikibooks", lang: "pt", prefix: "Livro de receitas/" },
  { wiki: "ruwikibooks", lang: "ru", prefix: "Рецепт:" },
  { wiki: "plwikibooks", lang: "pl", prefix: "Książka kucharska/" },
  { wiki: "nlwikibooks", lang: "nl", prefix: "Kookboek/" },
  { wiki: "huwikibooks", lang: "hu", prefix: "Szakácskönyv/" },
] as const

export type DumpPage = { title: string; text: string }

const unescape = (s: string) =>
  s
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&")

/**
 * Downloads each wiki's pages-articles dump (Wikimedia's recommended way to read in bulk, instead of
 * hammering the API) and keeps only the cookbook pages.
 */
export async function fetchCookbookDumps() {
  const dir = path.join(CACHE_DIR, "dumps")
  await mkdir(dir, { recursive: true })
  for (const { wiki, prefix } of COOKBOOKS) {
    const out = path.join(dir, `${wiki}.pages.json`)
    if (existsSync(out)) continue
    const bz2 = path.join(dir, `${wiki}.xml.bz2`)
    if (!existsSync(bz2)) {
      const res = await fetch(
        `https://dumps.wikimedia.org/${wiki}/latest/${wiki}-latest-pages-articles.xml.bz2`,
        {
          headers: { "User-Agent": USER_AGENT },
        },
      )
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${wiki} dump`)
      await writeFile(bz2, Buffer.from(await res.arrayBuffer()))
    }
    const pages: DumpPage[] = []
    const child = spawn("bzip2", ["-dc", bz2])
    let title = ""
    let text: string[] | undefined
    for await (const line of createInterface({ input: child.stdout })) {
      const t = /<title>([^<]*)<\/title>/.exec(line)
      if (t) {
        title = unescape(t[1])
        continue
      }
      if (!title.startsWith(prefix)) continue
      if (text === undefined) {
        const open = /<text[^>]*>(.*)$/.exec(line)
        if (!open) continue
        text = []
        const rest = open[1]
        if (rest.endsWith("</text>")) {
          pages.push({ title, text: unescape(rest.slice(0, -7)) })
          text = undefined
          title = ""
        } else text.push(rest)
      } else if (line.endsWith("</text>")) {
        text.push(line.slice(0, -7))
        pages.push({ title, text: unescape(text.join("\n")) })
        text = undefined
        title = ""
      } else text.push(line)
    }
    await writeFile(out, JSON.stringify(pages))
    console.log(`${wiki}: ${pages.length} cookbook pages`)
  }
}
