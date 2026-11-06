import type { CatalogEntry } from "@website/lib/catalog"
import { countryName } from "@website/lib/world"
import { DishPhoto } from "@website/components/site/dish-photo"
import Link from "next/link"

export function CatalogGrid({ results }: { results: CatalogEntry[] }) {
  return (
    <ul className={"mt-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-5 gap-y-7"}>
      {results.map((d) => (
        <li key={d.key}>
          <Link href={d.href} className={"group flex flex-col gap-2.5 text-ink"}>
            <DishPhoto file={d.image} width={360} className={"aspect-[4/3] rounded-[14px]"}>
              {d.hasRecipe && (
                <span
                  className={
                    "absolute top-2.5 left-2.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-jade-dark"
                  }
                >
                  Recipe
                </span>
              )}
            </DishPhoto>
            <span>
              <span className={"flex flex-wrap items-baseline gap-x-2"}>
                <span className={"font-semibold group-hover:text-chili"}>{d.name}</span>
                {d.localName && (
                  <span lang={"zh"} className={"font-cjk text-sm text-ink-3"}>
                    {d.localName}
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
  )
}
