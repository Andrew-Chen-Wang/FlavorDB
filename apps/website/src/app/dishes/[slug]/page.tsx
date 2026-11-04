import { DishRow } from "@website/components/site/dish-card"
import { FlavorBars } from "@website/components/site/flavor-bars"
import { MiniMap } from "@website/components/site/mini-map"
import { Breadcrumb, ChipLink, Container, SectionHeading, Tag } from "@website/components/site/ui"
import {
  dishes,
  findDish,
  getIngredient,
  getPlace,
  ingredientUseCount,
  placeLine,
  similarDishes,
} from "@website/lib/data"
import { MapPin } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { RecipeTabs } from "./recipe-tabs"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return dishes.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dish = findDish((await params).slug)
  return dish ? { title: dish.name, description: dish.summary } : {}
}

const sectionLinks = [
  ["history", "History"],
  ["found", "Where it's found"],
  ["variations", "Local variations"],
  ["recipes", "Recipes"],
  ["ingredients", "Ingredients"],
  ["similar", "Similar dishes"],
] as const

export default async function DishPage({ params }: Props) {
  const dish = findDish((await params).slug)
  if (!dish) notFound()

  const places = dish.places.map((p) => ({ ...p, place: getPlace(p.placeId) }))
  const mapPoints = [
    ...new Map(
      [...places.map((p) => p.place), ...dish.variations.map((v) => getPlace(v.placeId))].map(
        (p) => [p.id, { id: p.id, lng: p.lng, lat: p.lat, label: p.name }],
      ),
    ).values(),
  ]
  const similar = similarDishes(dish)
  const category = dish.category

  return (
    <main>
      <Container>
        <Breadcrumb
          items={[
            { href: "/dishes", label: "Dishes" },
            { href: "/dishes", label: category[0].toUpperCase() + category.slice(1) },
            { label: dish.name },
          ]}
        />

        <section className={"flex flex-wrap gap-12 pt-7"}>
          <div className={"min-w-0 flex-[999_1_560px]"}>
            <span className={"rounded-full bg-sand px-3 py-1.5 text-[13px] font-medium capitalize"}>
              {category}
            </span>
            <h1
              className={
                "mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1.5 font-display text-5xl leading-[1.05] font-bold tracking-[-0.025em] sm:text-[64px]"
              }
            >
              {dish.name}
              {dish.localName && (
                <span
                  lang={"zh"}
                  className={
                    "font-cjk text-3xl font-medium tracking-normal text-ink-3 sm:text-[40px]"
                  }
                >
                  {dish.localName}
                </span>
              )}
            </h1>
            <p className={"mt-[18px] max-w-[60ch] text-lg leading-relaxed text-ink-2 sm:text-xl"}>
              {dish.summary}
            </p>
            <div
              className={"photo-placeholder mt-8 flex aspect-video items-end rounded-[20px] p-4"}
            >
              <span className={"rounded-lg bg-white/90 px-2.5 py-1.5 text-[13px] text-ink-3"}>
                Photo coming soon
              </span>
            </div>
          </div>

          <aside className={"flex min-w-0 flex-[1_1_320px] flex-col gap-5"}>
            <div className={"rounded-[18px] border border-line p-6"}>
              <h2 className={"text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"}>
                Where it belongs
              </h2>
              <p className={"mt-2 mb-4 text-sm leading-normal text-ink-3"}>
                Listed in no particular order. FlavorDB doesn&apos;t rank origin claims.
              </p>
              <div className={"flex flex-wrap gap-2"}>
                {places.map(({ place }) => (
                  <Link
                    key={place.id}
                    href={`/places/${place.id}`}
                    className={
                      "inline-flex min-h-9 items-center rounded-full border border-line-strong px-3 text-sm hover:border-chili hover:text-chili"
                    }
                  >
                    {place.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className={"rounded-[18px] border border-line p-6"}>
              <h2
                className={"mb-4 text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"}
              >
                Flavor profile
              </h2>
              <FlavorBars flavor={dish.flavor} />
            </div>
            <div className={"flex flex-wrap gap-3"}>
              <a
                href={"#recipes"}
                className={
                  "inline-flex min-h-12 flex-[1_1_140px] items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white hover:bg-ink-2"
                }
              >
                {dish.recipes.length ? "Jump to recipe" : "See ingredients"}
              </a>
              <Link
                href={`/map?dish=${dish.slug}`}
                className={
                  "inline-flex min-h-12 flex-[1_1_140px] items-center justify-center rounded-full border border-ink text-[15px] font-semibold hover:bg-paper"
                }
              >
                See on map
              </Link>
            </div>
          </aside>
        </section>

        <nav
          aria-label={"On this page"}
          className={"mt-12 flex flex-wrap gap-1 border-y border-line text-[15px] font-medium"}
        >
          {sectionLinks.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={"px-3.5 py-3.5 hover:text-chili"}>
              {label}
            </a>
          ))}
        </nav>

        <section id={"history"} className={"scroll-mt-4 pt-14"}>
          <SectionHeading title={"A little history"} />
          <div className={"max-w-[66ch]"}>
            {dish.history.map((p) => (
              <p key={p} className={"mb-4 text-lg leading-[1.7] text-[#2E2B26]"}>
                {p}
              </p>
            ))}
          </div>
        </section>

        <section id={"found"} className={"scroll-mt-4 pt-[72px]"}>
          <SectionHeading
            title={"Where it's found"}
            description={`${places.length} ${places.length === 1 ? "place" : "places"}${dish.variations.length ? `, plus ${dish.variations.length} local variations` : ""}.`}
          />
          <div className={"flex flex-wrap gap-6"}>
            <div
              className={
                "h-[440px] min-w-0 flex-[999_1_560px] overflow-hidden rounded-[18px] border border-line-strong"
              }
            >
              <MiniMap points={mapPoints} label={`Map of the places ${dish.name} is eaten`} />
            </div>
            <ul className={"flex min-w-0 flex-[1_1_300px] flex-col"}>
              {places.map(({ place, note }) => (
                <li
                  key={place.id}
                  className={
                    "flex justify-between gap-4 border-b border-[#EEEAE0] py-3 text-[15px]"
                  }
                >
                  <Link href={`/places/${place.id}`} className={"font-medium hover:text-chili"}>
                    {place.name}
                  </Link>
                  <span className={"text-right text-ink-3"}>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id={"variations"} className={"scroll-mt-4 pt-[72px]"}>
          <SectionHeading
            title={"Local variations"}
            description={`How ${dish.name.toLowerCase()} changes from place to place.`}
          />
          {dish.variations.length === 0 ? (
            <p
              className={
                "rounded-2xl border border-dashed border-line-strong bg-paper p-6 text-ink-2"
              }
            >
              No variations recorded yet. Know one from your town or family? Suggest it.
            </p>
          ) : (
            <div className={"grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5"}>
              {dish.variations.map((v) => {
                const place = getPlace(v.placeId)
                return (
                  <article key={v.name} className={"flex gap-4 rounded-2xl border border-line p-5"}>
                    <div className={"photo-placeholder size-[88px] flex-none rounded-xl"} />
                    <div className={"min-w-0"}>
                      <Link
                        href={`/places/${place.id}`}
                        className={
                          "flex items-center gap-1 text-[13px] font-semibold text-chili hover:text-chili-dark"
                        }
                      >
                        <MapPin className={"size-3.5"} aria-hidden />
                        {place.name}
                      </Link>
                      <h3 className={"mt-1.5 text-lg font-semibold"}>
                        {v.name}{" "}
                        {v.localName && (
                          <span lang={"zh"} className={"font-cjk font-normal text-ink-3"}>
                            {v.localName}
                          </span>
                        )}
                      </h3>
                      <p className={"mt-1.5 text-[15px] leading-normal text-ink-2"}>
                        {v.description}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section id={"recipes"} className={"scroll-mt-4 pt-[72px]"}>
          <SectionHeading title={"Recipes"} />
          <RecipeTabs
            dishName={dish.name}
            recipes={dish.recipes.map((r) => ({
              ...r,
              ingredients: r.ingredients.map((ri) => ({
                ...ri,
                name: getIngredient(ri.ingredientId).name,
              })),
            }))}
            fallbackIngredients={dish.ingredients.map((id) => ({
              id,
              name: getIngredient(id).name,
            }))}
          />
        </section>

        <section id={"ingredients"} className={"scroll-mt-4 pt-[72px]"}>
          <SectionHeading
            title={"Ingredients"}
            description={"Across every variation. Pick one to see every other dish that uses it."}
          />
          <div className={"flex flex-wrap gap-2.5"}>
            {dish.ingredients.map((id) => {
              const n = ingredientUseCount(id)
              return (
                <ChipLink key={id} href={`/ingredients/${id}`}>
                  {getIngredient(id).name}
                  <span className={"text-[13px] text-ink-3"}>
                    {n} {n === 1 ? "dish" : "dishes"}
                  </span>
                </ChipLink>
              )
            })}
          </div>
        </section>

        <section id={"similar"} className={"scroll-mt-4 pt-[72px]"}>
          <SectionHeading title={"Similar dishes"} />
          <div className={"flex flex-wrap gap-6"}>
            {(
              [
                [
                  "Made the same way",
                  "Shared cooking fundamentals, whatever the flavor.",
                  similar.byTechnique,
                  "jade",
                ],
                ["Tastes alike", "Closest flavor profiles.", similar.byFlavor, "chili"],
              ] as const
            ).map(([title, description, list, tone]) => (
              <div
                key={title}
                className={"min-w-0 flex-[1_1_440px] rounded-[20px] border border-line p-7"}
              >
                <h3 className={"text-xl font-semibold"}>{title}</h3>
                <p className={"mt-1.5 mb-5 text-[15px] text-ink-3"}>{description}</p>
                <ul className={"flex flex-col gap-1"}>
                  {list.map(({ dish: other, score, why }) => (
                    <li key={other.slug}>
                      <DishRow
                        dish={other}
                        aside={
                          <span
                            className={
                              tone === "jade"
                                ? "text-sm font-semibold text-jade"
                                : "text-sm font-semibold text-chili"
                            }
                          >
                            {Math.round(score * 100)}%
                          </span>
                        }
                      >
                        <span className={"mt-0.5 block text-[13px] text-ink-3"}>
                          {placeLine(other)}
                        </span>
                        {why.length > 0 && (
                          <span className={"mt-1.5 flex flex-wrap gap-1.5"}>
                            {why.map((w) => (
                              <Tag key={w} tone={tone}>
                                {w}
                              </Tag>
                            ))}
                          </span>
                        )}
                      </DishRow>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div
          className={
            "mt-[72px] flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm text-ink-3"
          }
        >
          <span>Sources and photos are being added.</span>
          <span>Suggest an edit or a family variation</span>
        </div>
      </Container>
    </main>
  )
}
