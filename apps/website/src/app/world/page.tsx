import { Container } from "@website/components/site/ui"
import {
  PAGE_SIZE,
  commonsThumb,
  countryName,
  searchWorld,
  worldCountries,
  worldHref,
  worldStats,
} from "@website/lib/world"
import { cn } from "@website/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dishes from around the world",
  description:
    "Tens of thousands of dishes and recipes from openly licensed sources: Wikidata, Wikibooks and HowToCook.",
}

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function WorldPage({ searchParams }: Props) {
  const params = await searchParams
  const q = one(params.q) ?? ""
  const country = one(params.country) ?? ""
  const recipe = one(params.recipe) === "1"
  const page = Math.max(1, Number.parseInt(one(params.page) ?? "1", 10) || 1)
  const { total, results } = searchWorld({ q, country, recipe, page })
  const stats = worldStats()
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const hrefFor = (p: number) => {
    const sp = new URLSearchParams()
    if (q) sp.set("q", q)
    if (country) sp.set("country", country)
    if (recipe) sp.set("recipe", "1")
    if (p > 1) sp.set("page", String(p))
    const s = sp.toString()
    return s ? `/world?${s}` : "/world"
  }

  return (
    <main>
      <Container className={"pt-10"}>
        <h1
          className={
            "font-display text-[44px] leading-[1.05] font-bold tracking-[-0.025em] sm:text-[52px]"
          }
        >
          From around the world
        </h1>
        <p className={"mt-2.5 max-w-[68ch] text-lg text-ink-2"}>
          {stats.dishes.toLocaleString("en")} dishes and foods from {stats.countries} countries and
          territories, including {stats.withRecipe.toLocaleString("en")} with full recipes. Imported
          from{" "}
          <a
            href={"https://www.wikidata.org"}
            className={"text-chili underline-offset-2 hover:underline"}
          >
            Wikidata
          </a>
          ,{" "}
          <a
            href={"https://en.wikibooks.org/wiki/Cookbook:Table_of_Contents"}
            className={"text-chili underline-offset-2 hover:underline"}
          >
            Wikibooks Cookbook
          </a>{" "}
          and{" "}
          <a
            href={"https://github.com/Anduin2017/HowToCook"}
            className={"text-chili underline-offset-2 hover:underline"}
          >
            HowToCook
          </a>
          . Hand-checked entries live in{" "}
          <Link href={"/dishes"} className={"text-chili underline-offset-2 hover:underline"}>
            Dishes
          </Link>
          .
        </p>

        <form
          action={"/world"}
          className={
            "mt-8 flex flex-wrap items-end gap-3 rounded-[20px] border border-line-strong bg-paper p-3"
          }
        >
          <div className={"min-w-0 flex-[1_1_320px]"}>
            <label htmlFor={"world-q"} className={"sr-only"}>
              Search
            </label>
            <input
              id={"world-q"}
              name={"q"}
              type={"search"}
              defaultValue={q}
              aria-label={"Search dishes"}
              placeholder={"Dish, ingredient, cuisine or country"}
              className={
                "h-12 w-full rounded-xl bg-white px-4 text-base shadow-[inset_0_0_0_1px_#E4DFD3]"
              }
            />
          </div>
          <div className={"flex-[0_1_240px]"}>
            <label htmlFor={"world-country"} className={"sr-only"}>
              Country
            </label>
            <select
              id={"world-country"}
              name={"country"}
              defaultValue={country}
              aria-label={"Country"}
              className={"h-12 w-full rounded-xl border border-line-strong bg-white px-3 text-base"}
            >
              <option value={""}>All countries</option>
              {worldCountries().map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.count.toLocaleString("en")})
                </option>
              ))}
            </select>
          </div>
          <label className={"flex h-12 items-center gap-2 px-2 text-[15px]"}>
            <input
              type={"checkbox"}
              aria-label={"Has a recipe"}
              name={"recipe"}
              value={"1"}
              defaultChecked={recipe}
              className={"size-4 accent-jade"}
            />
            Has a recipe
          </label>
          <button
            type={"submit"}
            className={"h-12 rounded-xl bg-ink px-6 font-semibold text-white hover:bg-ink-2"}
          >
            Search
          </button>
        </form>

        <p className={"mt-6 text-[15px] text-ink-2"} aria-live={"polite"}>
          {total.toLocaleString("en")} {total === 1 ? "result" : "results"}
          {country && ` in ${countryName(country)}`}
          {pages > 1 && ` · page ${page} of ${pages}`}
        </p>

        <ul className={"mt-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-5 gap-y-7"}>
          {results.map((d) => (
            <li key={d.id}>
              <Link href={worldHref(d.id)} className={"group flex flex-col gap-2.5 text-ink"}>
                <span
                  className={
                    "photo-placeholder relative block aspect-[4/3] overflow-hidden rounded-[14px]"
                  }
                >
                  {d.image && (
                    // oxlint-disable-next-line nextjs/no-img-element -- Commons thumbnails, sized by URL
                    <img
                      src={commonsThumb(d.image, 360)}
                      alt={""}
                      loading={"lazy"}
                      className={"h-full w-full object-cover"}
                    />
                  )}
                  {d.recipes.length > 0 && (
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
                    {d.names.zh && d.names.zh !== d.name && (
                      <span lang={"zh"} className={"font-cjk text-sm text-ink-3"}>
                        {d.names.zh}
                      </span>
                    )}
                  </span>
                  <span className={"mt-1 line-clamp-2 block text-sm text-ink-3"}>
                    {[d.countries.slice(0, 3).map(countryName).join(", "), d.description]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {pages > 1 && (
          <nav
            aria-label={"Pages"}
            className={"mt-12 flex flex-wrap items-center justify-center gap-2"}
          >
            {[1, page - 2, page - 1, page, page + 1, page + 2, pages]
              .filter((p, i, all) => p >= 1 && p <= pages && all.indexOf(p) === i)
              .toSorted((a, b) => a - b)
              .map((p) => (
                <Link
                  key={p}
                  href={hrefFor(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-[15px]",
                    p === page
                      ? "border-ink bg-ink text-white"
                      : "border-line-strong hover:border-ink",
                  )}
                >
                  {p}
                </Link>
              ))}
          </nav>
        )}
      </Container>
    </main>
  )
}
