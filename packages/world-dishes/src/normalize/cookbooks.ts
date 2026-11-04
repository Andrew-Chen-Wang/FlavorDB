import { readFileSync } from "node:fs"
import path from "node:path"
import { COOKBOOKS, type DumpPage } from "../fetch/dumps"
import type { WorldDish, WorldRecipe } from "../types"

type Lang = (typeof COOKBOOKS)[number]["lang"]

/** Section headings, or template parameters, for ingredients and method in each language. */
const SECTIONS: Record<Lang, { ingredients: RegExp; steps: RegExp; fallback?: RegExp }> = {
  de: { ingredients: /^zutaten/i, steps: /^(zubereitung|anleitung)/i },
  // "Recette 1" headings wrap a whole recipe; only use them when there's no "Préparation".
  fr: {
    ingredients: /^ingr[ée]dients/i,
    steps: /^(pr[ée]paration|r[ée]alisation)/i,
    fallback: /^recette/i,
  },
  es: { ingredients: /^ingredientes/i, steps: /^(procedimiento|preparaci[óo]n|elaboraci[óo]n)/i },
  it: { ingredients: /^ingredienti/i, steps: /^(preparazione|procedimento)/i },
  zh: {
    ingredients: /^(材料|原料|用料|食材|配料)/,
    steps: /^(做法|作法|制作方法|製作方法|步骤|步驟|制法)/,
  },
  ja: { ingredients: /^材料/, steps: /^(作り方|手順|調理方法)/ },
  pt: { ingredients: /^ingredientes/i, steps: /^(modo de )?(preparo|preparação)/i },
  ru: { ingredients: /^(состав|ингредиенты)/i, steps: /^приготовление/i },
  pl: {
    ingredients: /^składniki/i,
    steps: /^(przygotowanie|przyrządzenie|sposób przyrządzania|wykonanie)/i,
  },
  nl: { ingredients: /^(ingrediënten|benodigdheden)/i, steps: /^(bereidingswijze|bereiding)/i },
  hu: { ingredients: /^hozzávalók/i, steps: /^(elkészítés|elkészítése)/i },
}

/** A bold label standing in for a heading, as in Hungarian '''Hozzávalók:''' */
const BOLD_LABEL = /^:?\s*'''\s*([^']+?)\s*:?\s*'''\s*:?\s*$/
const STRUCTURE_LINE = /^(=+[^=]+=+\s*$|\||\{\||\{\{!\}\})/

/**
 * Templates that link a word and display it: ingredients (Spanish {{ing|cebolla}}, French
 * {{i|pomme de terre}} or {{i|'=oui|ail}}, Polish {{lpg|cebula zwyczajna|cebula}}, Dutch {{Kb|olijfolie}})
 * and other links (recipes, utensils, techniques, foreign words). They keep their last plain argument.
 */
const ING_TEMPLATE = /\{\{\s*(?:i'?|ing|ingr[ée]dients?|ingrediente|lpg|kb)\s*\|([^}]*)\}\}/gi
const LINK_TEMPLATE = /\{\{\s*(?:lg|sr|rec|ute|coc|w|lang-[a-z]+)\s*\|([^}]*)\}\}/gi
/** Polish {{C|200}} is a temperature; Spanish {{min|5}} a time. */
const UNIT_TEMPLATE = /\{\{\s*(c|min)\s*\|\s*([^}|]*)\}\}/gi
/** The text a template displays: its last plain argument, plus a Polish ending such as {{lpg|strąk|p=ach}}. */
function templateName(args: string): string {
  const parts = args.split("|")
  const plain = parts.filter((a) => !a.includes("="))
  // Polish puts the ending after the word ({{lpg|strąk|p=ach}}); Dutch {{Kb|p=ei|eieren}} uses p= for the page.
  const endingIndex = parts.findIndex((a) => /^\s*p\s*=/.test(a))
  const ending = endingIndex > 0 ? parts[endingIndex].split("=")[1]?.trim() : undefined
  const text = plain.at(-1)?.trim() ?? ""
  // Polish link templates add an inflection when there's no separate display text.
  return ending && plain.length === 1 && /^[\p{Ll}]+$/u.test(ending) ? text + ending : text
}

function stripMarkup(text: string): string {
  return text
    .replaceAll(ING_TEMPLATE, (_, args: string) => templateName(args))
    .replaceAll(LINK_TEMPLATE, (_, args: string) => templateName(args))
    .replaceAll(
      UNIT_TEMPLATE,
      (_, unit: string, value: string) =>
        `${value.trim()} ${unit.toLowerCase() === "c" ? "°C" : "min"}`,
    )
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

/** Text under a heading that matches, or the value of a template parameter that matches. */
function block(text: string, matcher: RegExp): string[] {
  const lines = text.split("\n")
  for (let i = 0; i < lines.length; i++) {
    const heading = /^(=+)\s*([^=]+?)\s*=+\s*$/.exec(lines[i])
    const param = /^\|\s*([^=|]+?)\s*=\s*(.*)$/.exec(lines[i])
    const bold = BOLD_LABEL.exec(lines[i])
    if (bold && matcher.test(bold[1])) {
      const out: string[] = []
      for (const line of lines.slice(i + 1)) {
        if (BOLD_LABEL.test(line) || STRUCTURE_LINE.test(line)) break
        out.push(line)
      }
      return out
    }
    if (heading && matcher.test(heading[2])) {
      const level = heading[1].length
      const out: string[] = []
      for (const line of lines.slice(i + 1)) {
        const h = /^(=+)[^=]+=+\s*$/.exec(line)
        if (h && h[1].length <= level) break
        out.push(line)
      }
      return out
    }
    if (param && matcher.test(param[1])) {
      const out = param[2] ? [param[2]] : []
      for (const line of lines.slice(i + 1)) {
        if (/^\|\s*[^=|]+=/.test(line) || line.startsWith("}}")) break
        out.push(line)
      }
      return out
    }
  }
  return []
}

const listLines = (lines: string[]) =>
  lines.filter((l) => /^[*#]/.test(l)).map((l) => stripMarkup(l.replace(/^[*#:;]+/, "")))

/** Steps may be a numbered list or plain paragraphs. */
/**
 * Steps may be a numbered list or plain paragraphs. When a section has both, as in German pages
 * that use bullets as sub-headings ("* Kuchenboden") over paragraphs, the longer text wins.
 */
function stepLines(lines: string[]): string[] {
  const listed = listLines(lines).filter(Boolean)
  const paragraphs = lines
    .filter((l) => !/^[*#]/.test(l))
    .map((l) => l.trim().replace(/^:+\s*/, ""))
    .filter(
      (l) =>
        l &&
        !BOLD_LABEL.test(l) &&
        !l.startsWith("[[") &&
        !l.startsWith("{{") &&
        !l.startsWith("|") &&
        !l.startsWith("="),
    )
    .map(stripMarkup)
    .filter((l) => l.length > 3)
  const length = (xs: string[]) => xs.reduce((n, x) => n + x.length, 0)
  return listed.length && length(listed) >= length(paragraphs) ? listed : paragraphs
}

function ingredientNames(lines: string[]): string[] {
  const names: string[] = []
  for (const line of lines) {
    const args = [...line.matchAll(ING_TEMPLATE)].at(-1)?.[1]
    const ing = args === undefined ? undefined : templateName(args)
    const link = [...line.matchAll(/\[\[([^|\]#]+)(?:\|[^\]]*)?\]\]/g)]
      .map((m) => m[1].split("/").at(-1)!.trim())
      .at(-1)
    const name = (ing ?? link)?.trim()
    if (name && !name.includes(":")) names.push(name)
  }
  return [...new Set(names)]
}

export const slug = (s: string) =>
  s
    .normalize("NFKC")
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}]+/gu, "-")
    .replaceAll(/^-|-$/g, "")

const SITE: Record<Lang, string> = {
  de: "de.wikibooks.org",
  fr: "fr.wikibooks.org",
  es: "es.wikibooks.org",
  it: "it.wikibooks.org",
  zh: "zh.wikibooks.org",
  ja: "ja.wikibooks.org",
  pt: "pt.wikibooks.org",
  ru: "ru.wikibooks.org",
  pl: "pl.wikibooks.org",
  nl: "nl.wikibooks.org",
  hu: "hu.wikibooks.org",
}

const REDIRECT =
  /^#\s*(redirect|weiterleitung|redirection|redirección|rinvia|重定向|転送|перенаправление|patrz|doorverwijzing|átirányítás|redirecionamento)/i

export function parseCookbookPage(page: DumpPage, lang: Lang): WorldDish | undefined {
  if (REDIRECT.test(page.text.trim())) return undefined
  // Hungarian titles number their variants ("Rakott puliszka I.", "Pacalpörkölt 07."); the id keeps the number.
  const title = (
    page.title
      .replace(/^[^/:]+:/, "")
      .split("/")
      .at(-1) ?? page.title
  ).trim()
  const name = title
    .replace(/\s+(?:[IVX]+|\d+)\.?$/, "")
    .replace(/(?<=\p{L})\d$/u, "")
    .trim()
  if (!name) return undefined
  const { ingredients: ingMatch, steps: stepMatch, fallback } = SECTIONS[lang]
  const ingredientBlock = block(page.text, ingMatch)
  const ingredients = listLines(ingredientBlock.filter((l) => l.startsWith("*"))).filter(Boolean)
  // Some pages put ingredients and method under one heading ("Ingredientes e Preparo"): there the
  // bullet points are the ingredients and everything else is the method.
  let steps = stepLines(block(page.text, stepMatch))
  if (steps.length === 0 && fallback)
    steps = stepLines(block(page.text, fallback).filter((l) => !l.startsWith("*")))
  if (steps.length === 0) steps = stepLines(ingredientBlock.filter((l) => !l.startsWith("*")))
  if (ingredients.length === 0 || steps.length === 0) return undefined

  const url = `https://${SITE[lang]}/wiki/${encodeURIComponent(page.title.replaceAll(" ", "_"))}`
  const source = { name: "Wikibooks Cookbook", url, license: "CC-BY-SA-4.0" } as const
  const recipe: WorldRecipe = {
    title,
    lang,
    ingredients: ingredients.map((item) => ({ item })),
    steps,
    source,
  }
  return {
    id: `wikibooks-${lang}:${slug(title)}`,
    name,
    names: { [lang]: name },
    countries: [],
    cuisines: [],
    kinds: [],
    ingredients: ingredientNames(ingredientBlock),
    wikipedia: {},
    recipes: [recipe],
    sources: [source],
  }
}

export function loadCookbooks(cacheDir: string): WorldDish[] {
  return COOKBOOKS.flatMap(({ wiki, lang }) => {
    const pages = JSON.parse(
      readFileSync(path.join(cacheDir, "dumps", `${wiki}.pages.json`), "utf8"),
    ) as DumpPage[]
    const seen = new Set<string>()
    return pages.flatMap((p) => {
      const dish = parseCookbookPage(p, lang)
      if (!dish || seen.has(dish.id)) return []
      seen.add(dish.id)
      return [dish]
    })
  })
}
