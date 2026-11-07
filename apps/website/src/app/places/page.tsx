import { Container } from "@website/components/site/ui"
import { placeCatalogGroups } from "@website/lib/place-data"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Places" }

export default function PlacesPage() {
  const groups = placeCatalogGroups()
  return (
    <main>
      <Container className={"pt-10"}>
        <h1 className={"font-display text-[52px] font-bold tracking-[-0.025em]"}>Places</h1>
        <p className={"mt-2 max-w-[62ch] text-[17px] text-ink-2"}>
          Countries, regions and cities, and the dishes that belong to each. A dish can belong to
          many places.
        </p>
        <div className={"mt-10 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-10"}>
          {groups.map((g) => (
            <section key={g.code}>
              <h2 className={"mb-3 border-b border-line pb-2 font-display text-xl font-bold"}>
                <Link href={g.href} className={"hover:text-chili"}>
                  {g.name}
                </Link>
              </h2>
              <ul>
                <li>
                  <Link
                    href={g.href}
                    className={
                      "flex min-h-10 items-center justify-between gap-3 text-[15px] font-semibold hover:text-chili"
                    }
                  >
                    <span>All of {g.name}</span>
                    <span className={"text-[13px] text-ink-3"}>{g.count.toLocaleString("en")}</span>
                  </Link>
                </li>
                {g.places.map(({ place, count }) => (
                  <li key={place.id}>
                    <Link
                      href={`/places/${place.id}`}
                      className={
                        "flex min-h-10 items-center justify-between gap-3 text-[15px] hover:text-chili"
                      }
                    >
                      <span className={place.kind === "country" ? "font-semibold" : undefined}>
                        {place.kind === "country" ? `All of ${place.name}` : place.name}
                      </span>
                      <span className={"text-[13px] text-ink-3"}>{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </main>
  )
}
