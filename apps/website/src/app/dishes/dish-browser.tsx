"use client"

import { cn } from "@website/lib/utils"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export type DishSummary = {
  slug: string
  name: string
  localName: string
  category: string
  placeLine: string
  countries: string[]
  hasRecipe: boolean
  placeCount: number
  searchText: string
}

const CATEGORIES = [
  "main",
  "noodles",
  "dumplings",
  "soup",
  "street food",
  "breakfast",
  "dessert",
  "snack",
  "side",
  "rice",
  "bread",
]

type Sort = "az" | "places"

export function DishBrowser({
  dishes,
  countries,
}: {
  dishes: DishSummary[]
  countries: { code: string; name: string; count: number }[]
}) {
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [country, setCountry] = useState(params.get("country") ?? "all")
  const [category, setCategory] = useState("all")
  const [recipeOnly, setRecipeOnly] = useState(false)
  const [sort, setSort] = useState<Sort>("az")

  const q = query.trim().toLowerCase()
  const hits = dishes
    .filter((d) => !q || q.split(/\s+/).every((w) => d.searchText.includes(w)))
    .filter((d) => country === "all" || d.countries.includes(country))
    .filter((d) => category === "all" || d.category === category)
    .filter((d) => !recipeOnly || d.hasRecipe)
    .toSorted((a, b) =>
      sort === "places" ? b.placeCount - a.placeCount : a.name.localeCompare(b.name),
    )

  return (
    <div className={"mt-8 flex flex-wrap items-start gap-10"}>
      <aside
        aria-label={"Filters"}
        className={"flex max-w-[280px] flex-[1_1_240px] flex-col gap-7"}
      >
        <div>
          <label
            htmlFor={"dish-q"}
            className={
              "mb-2.5 block text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"
            }
          >
            Search
          </label>
          <input
            aria-label={"Search dishes"}
            id={"dish-q"}
            type={"search"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            placeholder={"Dish, ingredient or place"}
            className={
              "h-11 w-full rounded-xl border border-line-strong bg-paper px-3.5 text-[15px]"
            }
          />
        </div>
        <fieldset>
          <legend
            className={"mb-2.5 text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"}
          >
            Country or territory
          </legend>
          <div className={"flex flex-col gap-0.5"}>
            {[{ code: "all", name: "All", count: dishes.length }, ...countries].map((c) => (
              <button
                key={c.code}
                type={"button"}
                aria-pressed={country === c.code}
                onClick={() => {
                  setCountry(c.code)
                }}
                className={cn(
                  "flex min-h-10 items-center justify-between rounded-[10px] px-3 text-left text-[15px]",
                  country === c.code ? "bg-sand font-semibold" : "hover:bg-paper",
                )}
              >
                <span>{c.name}</span>
                <span className={"text-[13px] text-ink-3"}>{c.count}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend
            className={"mb-2.5 text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"}
          >
            Type of dish
          </legend>
          <div className={"flex flex-wrap gap-1.5"}>
            {["all", ...CATEGORIES].map((c) => (
              <button
                key={c}
                type={"button"}
                aria-pressed={category === c}
                onClick={() => {
                  setCategory(c)
                }}
                className={cn(
                  "min-h-9 rounded-full border px-3 text-sm capitalize",
                  category === c
                    ? "border-ink bg-ink text-white"
                    : "border-line-strong bg-white hover:border-ink",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type={"button"}
          role={"switch"}
          aria-checked={recipeOnly}
          onClick={() => {
            setRecipeOnly(!recipeOnly)
          }}
          className={"flex min-h-11 items-center gap-3 text-left text-[15px]"}
        >
          <span
            className={cn(
              "relative h-[26px] w-11 flex-none rounded-full",
              recipeOnly ? "bg-jade" : "bg-[#C9C2B2]",
            )}
          >
            <span
              className={cn(
                "absolute top-[3px] size-5 rounded-full bg-white transition-all",
                recipeOnly ? "left-[21px]" : "left-[3px]",
              )}
            />
          </span>
          Only dishes with a recipe
        </button>
      </aside>

      <section aria-label={"Results"} className={"min-w-0 flex-[999_1_640px]"}>
        <div className={"mb-5 flex flex-wrap items-center justify-between gap-3"}>
          <span className={"text-[15px] text-ink-2"} aria-live={"polite"}>
            {hits.length} {hits.length === 1 ? "dish" : "dishes"}
          </span>
          <div className={"flex items-center gap-2 text-sm"}>
            <label htmlFor={"sort"} className={"text-ink-3"}>
              Sort
            </label>
            <select
              id={"sort"}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as Sort)
              }}
              className={"h-10 rounded-[10px] border border-line-strong bg-white px-3"}
            >
              <option value={"az"}>A to Z</option>
              <option value={"places"}>Most places</option>
            </select>
          </div>
        </div>
        {hits.length === 0 ? (
          <p
            className={
              "rounded-2xl border border-dashed border-line-strong bg-paper p-8 text-ink-2"
            }
          >
            No dishes match. Try a different search or clear a filter.
          </p>
        ) : (
          <div className={"grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-x-5 gap-y-7"}>
            {hits.map((d) => (
              <Link
                key={d.slug}
                href={`/dishes/${d.slug}`}
                className={"group flex flex-col gap-2.5 text-ink"}
              >
                <span className={"photo-placeholder relative block aspect-[4/3] rounded-[14px]"}>
                  {d.hasRecipe && (
                    <span
                      className={
                        "absolute top-2.5 left-2.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-jade-dark"
                      }
                    >
                      Recipe
                    </span>
                  )}
                </span>
                <span>
                  <span className={"flex flex-wrap items-baseline gap-x-2"}>
                    <span className={"font-semibold group-hover:text-chili"}>{d.name}</span>
                    {d.localName && (
                      <span lang={"zh"} className={"font-cjk text-sm text-ink-3"}>
                        {d.localName}
                      </span>
                    )}
                  </span>
                  <span className={"mt-1 block text-sm text-ink-3"}>{d.placeLine}</span>
                  <span className={"mt-0.5 block text-[13px] text-ink-3 capitalize"}>
                    {d.category}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
