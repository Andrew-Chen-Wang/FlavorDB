/** Where a piece of data came from, and the terms it can be reused under. */
export type Source = {
  name: "Wikidata" | "Wikibooks Cookbook" | "HowToCook"
  url: string
  license: "CC0-1.0" | "CC-BY-SA-4.0" | "Unlicense"
}

export type WorldRecipe = {
  title: string
  /** Language of the recipe text */
  lang: "en" | "zh" | "de" | "fr" | "es" | "it" | "ja" | "pt" | "ru" | "pl" | "nl" | "hu"
  serves?: string
  ingredients: { item: string; amount?: string }[]
  steps: string[]
  source: Source
}

/**
 * A dish imported from an open source. Unlike the hand-curated seed data, fields are only as
 * complete as the source: many dishes have ingredients but no recipe, and some have neither.
 */
export type WorldDish = {
  /** Stable id: the Wikidata QID when the dish is on Wikidata, otherwise `<source>:<slug>` */
  id: string
  name: string
  /** Names in other languages, keyed by BCP 47 tag */
  names: Record<string, string>
  description?: string
  /** ISO 3166-1 alpha-2 codes. Every country the sources name; none is ranked above another. */
  countries: string[]
  cuisines: string[]
  /** What kind of food it is, e.g. "soup", "dumpling", "cheese", from the source's own classification */
  kinds: string[]
  /** Ingredient names in English where known */
  ingredients: string[]
  /** Wikimedia Commons file name */
  image?: string
  wikipedia: Record<string, string>
  recipes: WorldRecipe[]
  sources: Source[]
}
