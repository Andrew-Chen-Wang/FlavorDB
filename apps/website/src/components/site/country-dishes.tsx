import { CatalogGrid } from "@website/components/site/catalog-grid"
import { SectionHeading } from "@website/components/site/ui"
import { importedCountryPage } from "@website/lib/place-data"
import { countryName } from "@website/lib/world"
import { cn } from "@website/lib/utils"
import Link from "next/link"

export function CountryDishes({
  country,
  placeId,
  placeName,
  requestedPage,
  countryOnly = false,
}: {
  country: string
  placeId: string
  placeName: string
  requestedPage?: string | string[]
  countryOnly?: boolean
}) {
  const { results, total, pages, page } = importedCountryPage(country, requestedPage)
  if (!total) return null
  const name = countryName(country)
  return (
    <section id={"imported-dishes"} className={"scroll-mt-4 pt-16"}>
      <SectionHeading
        title={countryOnly ? `More dishes from ${name}` : `From across ${name}`}
        description={
          countryOnly
            ? "Imported dishes, with recipes and photos first."
            : `These imported dishes belong to ${name}; the sources do not identify them specifically with ${placeName}.`
        }
      />
      <p className={"mb-5 text-sm text-ink-3"}>
        {total.toLocaleString("en")} imported dishes{pages > 1 && ` · page ${page} of ${pages}`}
      </p>
      <CatalogGrid results={results} />
      {pages > 1 && (
        <nav
          aria-label={"Imported dish pages"}
          className={"mt-10 flex flex-wrap justify-center gap-2"}
        >
          {[1, page - 1, page, page + 1, pages]
            .filter((n, i, all) => n >= 1 && n <= pages && all.indexOf(n) === i)
            .toSorted((a, b) => a - b)
            .map((n) => (
              <Link
                key={n}
                href={`/places/${placeId}?page=${n}#imported-dishes`}
                aria-current={n === page ? "page" : undefined}
                className={cn(
                  "flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-[15px]",
                  n === page
                    ? "border-ink bg-ink text-white"
                    : "border-line-strong hover:border-ink",
                )}
              >
                {n}
              </Link>
            ))}
        </nav>
      )}
    </section>
  )
}
