import { Container } from "@website/components/site/ui"
import {
  COUNTRY_NAMES,
  countriesOf,
  dishes,
  getIngredient,
  getPlace,
  placeLine,
} from "@website/lib/data"
import type { Metadata } from "next"
import { Suspense } from "react"
import { DishBrowser, type DishSummary } from "./dish-browser"

export const metadata: Metadata = { title: "Dishes" }

export default function DishesPage() {
  const summaries: DishSummary[] = dishes
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      localName: d.localName?.split(" / ")[0] ?? "",
      category: d.category,
      placeLine: placeLine(d),
      countries: countriesOf(d),
      hasRecipe: d.recipes.length > 0,
      placeCount: d.places.length,
      searchText: [
        d.name,
        d.localName ?? "",
        d.summary,
        ...d.places.map((p) => getPlace(p.placeId).name),
        ...d.variations.map((v) => `${v.name} ${getPlace(v.placeId).name}`),
        ...d.ingredients.map((i) => {
          const ing = getIngredient(i)
          return [ing.name, ...(ing.aliases ?? [])].join(" ")
        }),
      ]
        .join(" ")
        .toLowerCase(),
    }))
    .toSorted((a, b) => a.name.localeCompare(b.name))

  const countryCounts = new Map<string, number>()
  for (const s of summaries)
    for (const c of s.countries) countryCounts.set(c, (countryCounts.get(c) ?? 0) + 1)
  const countries = [...countryCounts.entries()]
    .toSorted((a, b) => b[1] - a[1])
    .map(([code, count]) => ({ code, name: COUNTRY_NAMES[code] ?? code, count }))

  return (
    <main>
      <Container className={"pt-10"}>
        <h1 className={"font-display text-[52px] font-bold tracking-[-0.025em]"}>Dishes</h1>
        <p className={"mt-2 text-[17px] text-ink-2"}>
          {dishes.length} dishes from the United States, China and the places they&apos;re shared
          with.
        </p>
        <Suspense>
          <DishBrowser dishes={summaries} countries={countries} />
        </Suspense>
      </Container>
    </main>
  )
}
