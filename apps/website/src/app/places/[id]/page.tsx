import { dishesWithIngredient } from "@flavor-db/seed-data"
import { DishCard } from "@website/components/site/dish-card"
import { MiniMap } from "@website/components/site/mini-map"
import { Breadcrumb, ChipLink, Container, SectionHeading, Stat } from "@website/components/site/ui"
import {
  COUNTRY_NAMES,
  STAPLE_INGREDIENTS,
  countryPlace,
  dishesForPlace,
  findPlace,
  getIngredient,
  getPlace,
  places,
  placesWithDishes,
} from "@website/lib/data"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return placesWithDishes().flatMap((g) => g.places.map(({ place }) => ({ id: place.id })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const place = findPlace((await params).id)
  return place ? { title: place.name } : {}
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = Math.PI / 180
  const h =
    Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(((b.lng - a.lng) * rad) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

export default async function PlacePage({ params }: Props) {
  const place = findPlace((await params).id)
  if (!place) notFound()

  const dishes = dishesForPlace(place)
  const fromHere = dishes.filter(
    (d) => d.places.some((p) => p.placeId === place.id) || place.kind === "country",
  )
  const variationsHere = dishes.flatMap((d) =>
    d.variations.filter((v) => v.placeId === place.id).map((v) => ({ dish: d, variation: v })),
  )
  const shared = fromHere.filter((d) => d.places.length > 1)

  // Ingredients used here far more than elsewhere.
  const counts = new Map<string, number>()
  for (const d of fromHere)
    for (const id of d.ingredients) counts.set(id, (counts.get(id) ?? 0) + 1)
  const signature = [...counts.entries()]
    .filter(([id]) => !STAPLE_INGREDIENTS.has(id))
    .map(([id, n]) => ({ id, score: n / Math.sqrt(dishesWithIngredient(id).length) }))
    .toSorted((a, b) => b.score - a.score)
    .slice(0, 10)

  const nearby = places
    .filter((p) => p.id !== place.id && p.kind !== "country" && p.country === place.country)
    .map((p) => ({ place: p, km: distanceKm(place, p), count: dishesForPlace(p).length }))
    .filter((p) => p.count > 0 && p.km < 900)
    .toSorted((a, b) => a.km - b.km)
    .slice(0, 6)

  const country = countryPlace(place.country)
  const minSpan = place.kind === "city" ? 8 : place.kind === "region" ? 12 : 50

  return (
    <main>
      <Container>
        <Breadcrumb
          items={[
            { href: "/places", label: "Places" },
            ...(country && country.id !== place.id
              ? [{ href: `/places/${country.id}`, label: country.name }]
              : []),
            { label: place.name },
          ]}
        />
        <section className={"flex flex-wrap items-stretch gap-10 pt-7"}>
          <div className={"flex min-w-0 flex-[999_1_520px] flex-col justify-center"}>
            <span
              className={
                "self-start rounded-full bg-sand px-3 py-1.5 text-[13px] font-medium capitalize"
              }
            >
              {place.kind}
              {place.kind !== "country" && ` · ${COUNTRY_NAMES[place.country] ?? place.country}`}
            </span>
            <h1
              className={
                "mt-4 font-display text-5xl leading-[1.05] font-bold tracking-[-0.025em] sm:text-[64px]"
              }
            >
              {place.name}
            </h1>
            <div className={"mt-6 flex flex-wrap gap-8"}>
              <Stat
                value={fromHere.length}
                label={fromHere.length === 1 ? "dish from here" : "dishes from here"}
              />
              <Stat
                value={fromHere.filter((d) => d.recipes.length).length}
                label={"with recipes"}
              />
              <Stat value={variationsHere.length} label={"local variations"} />
            </div>
          </div>
          <Link
            href={`/map?place=${place.id}`}
            aria-label={`Open ${place.name} on the map`}
            className={
              "relative block min-h-[340px] min-w-0 flex-[1_1_380px] overflow-hidden rounded-[20px] border border-line-strong"
            }
          >
            <MiniMap
              points={[{ id: place.id, lng: place.lng, lat: place.lat, label: place.name }]}
              minSpan={minSpan}
              width={560}
              height={380}
              label={`Map showing ${place.name}`}
            />
            <span
              className={
                "absolute right-3.5 bottom-3.5 rounded-[10px] bg-white px-3 py-2 text-[13px] font-semibold"
              }
            >
              Open on map
            </span>
          </Link>
        </section>

        <section className={"pt-16"}>
          <SectionHeading title={`Dishes from ${place.name}`} />
          {fromHere.length ? (
            <div className={"grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6"}>
              {fromHere.map((d) => (
                <DishCard key={d.slug} dish={d} subtitle={d.summary} />
              ))}
            </div>
          ) : (
            <p className={"text-ink-2"}>No dishes are listed for {place.name} itself yet.</p>
          )}
        </section>

        {variationsHere.length > 0 && (
          <section className={"pt-16"}>
            <SectionHeading
              title={"Local variations"}
              description={`Dishes from elsewhere, made the ${place.name} way.`}
            />
            <div className={"grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5"}>
              {variationsHere.map(({ dish, variation }) => (
                <Link
                  key={`${dish.slug}-${variation.name}`}
                  href={`/dishes/${dish.slug}#variations`}
                  className={"rounded-2xl border border-line p-5 text-ink hover:border-chili"}
                >
                  <div className={"text-[13px] font-semibold text-chili"}>
                    A take on {dish.name}
                  </div>
                  <div className={"mt-1.5 text-lg font-semibold"}>
                    {variation.name}{" "}
                    {variation.localName && (
                      <span className={"font-cjk font-normal text-ink-3"}>
                        {variation.localName}
                      </span>
                    )}
                  </div>
                  <p className={"mt-1.5 text-[15px] leading-normal text-ink-2"}>
                    {variation.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className={"flex flex-wrap gap-6 pt-16"}>
          {shared.length > 0 && (
            <div className={"min-w-0 flex-[1_1_440px] rounded-[20px] border border-line p-7"}>
              <h2 className={"text-xl font-semibold"}>Shared with other places</h2>
              <p className={"mt-1.5 mb-4 text-[15px] text-ink-3"}>
                Dishes that belong here and elsewhere too.
              </p>
              <ul>
                {shared.map((d) => (
                  <li
                    key={d.slug}
                    className={
                      "flex justify-between gap-4 border-b border-[#EEEAE0] py-3 text-[15px] last:border-0"
                    }
                  >
                    <Link href={`/dishes/${d.slug}`} className={"font-medium hover:text-chili"}>
                      {d.name}
                    </Link>
                    <span className={"text-right text-ink-3"}>
                      {d.places
                        .map((p) => getPlace(p.placeId))
                        .filter((p) => p.id !== place.id)
                        .slice(0, 3)
                        .map((p) => p.name)
                        .join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {signature.length > 0 && (
            <div className={"min-w-0 flex-[1_1_440px] rounded-[20px] border border-line p-7"}>
              <h2 className={"text-xl font-semibold"}>Signature ingredients</h2>
              <p className={"mt-1.5 mb-4 text-[15px] text-ink-3"}>
                Used here more than anywhere else.
              </p>
              <div className={"flex flex-wrap gap-2"}>
                {signature.map(({ id }) => (
                  <ChipLink key={id} href={`/ingredients/${id}`}>
                    {getIngredient(id).name}
                  </ChipLink>
                ))}
              </div>
            </div>
          )}
        </section>

        {nearby.length > 0 && (
          <section className={"pt-16"}>
            <SectionHeading title={"Nearby"} />
            <div className={"grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5"}>
              {nearby.map(({ place: p, km, count }) => (
                <Link
                  key={p.id}
                  href={`/places/${p.id}`}
                  className={"rounded-[18px] bg-stone p-[22px] text-ink hover:text-chili"}
                >
                  <div className={"text-lg font-semibold"}>{p.name}</div>
                  <div className={"mt-1.5 text-sm text-ink-2"}>
                    {count} {count === 1 ? "dish" : "dishes"} · {Math.round(km)} km away
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  )
}
