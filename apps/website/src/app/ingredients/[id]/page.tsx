import { dishImages, dishesWithIngredient } from "@flavor-db/seed-data"
import { DishPhoto } from "@website/components/site/dish-photo"
import { worldDishesWithIngredient } from "@website/lib/ingredient-index"
import { countryName, worldHref } from "@website/lib/world"
import { Breadcrumb, ChipLink, Container, SectionHeading, Stat } from "@website/components/site/ui"
import {
  findIngredient,
  getPlace,
  ingredients,
  pairedIngredients,
  placeLine,
} from "@website/lib/data"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { layoutIngredientGraph } from "./graph-layout"
import { IngredientGraph } from "./ingredient-graph"

type Props = { params: Promise<{ id: string }> }

/** Hand-written dishes' ingredients are built ahead of time; the rest render on first request. */
export const revalidate = 86400
export function generateStaticParams() {
  return ingredients.filter((i) => dishesWithIngredient(i.id).length).map((i) => ({ id: i.id }))
}

const WORLD_SHOWN = 48

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ingredient = findIngredient((await params).id)
  return ingredient ? { title: ingredient.name } : {}
}

export default async function IngredientPage({ params }: Props) {
  const ingredient = findIngredient((await params).id)
  if (!ingredient) notFound()

  const dishes = dishesWithIngredient(ingredient.id)
  const world = worldDishesWithIngredient(ingredient.id)
  const paired = pairedIngredients(ingredient.id)
  const placeIds = [...new Set(dishes.flatMap((d) => d.places.map((p) => p.placeId)))]
  const cjk = ingredient.aliases?.filter((a) => /\p{Script=Han}/u.test(a)) ?? []
  const otherAliases = ingredient.aliases?.filter((a) => !/\p{Script=Han}/u.test(a)) ?? []

  return (
    <main>
      <Container>
        <Breadcrumb
          items={[{ href: "/ingredients", label: "Ingredients" }, { label: ingredient.name }]}
        />
        <section className={"flex flex-wrap items-end gap-10 pt-7"}>
          <div className={"min-w-0 flex-[999_1_560px]"}>
            <span className={"rounded-full bg-sand px-3 py-1.5 text-[13px] font-medium capitalize"}>
              {ingredient.category}
            </span>
            <h1
              className={
                "mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1.5 font-display text-5xl leading-[1.05] font-bold tracking-[-0.025em] sm:text-[60px]"
              }
            >
              {ingredient.name}
              {cjk.length > 0 && (
                <span
                  lang={"zh"}
                  className={"font-cjk text-3xl font-medium tracking-normal text-ink-3 sm:text-4xl"}
                >
                  {cjk.join(" · ")}
                </span>
              )}
            </h1>
            {otherAliases.length > 0 && (
              <p className={"mt-3 text-lg text-ink-2"}>Also called {otherAliases.join(", ")}.</p>
            )}
          </div>
          <div className={"flex flex-[1_1_280px] gap-8"}>
            <Stat
              value={dishes.length + world.length}
              label={dishes.length + world.length === 1 ? "dish" : "dishes"}
            />
            {dishes.length > 0 && (
              <>
                <Stat value={paired.length} label={"paired ingredients"} />
                <Stat value={placeIds.length} label={"places"} />
              </>
            )}
          </div>
        </section>

        {dishes.length > 0 && (
          <section className={"pt-12"}>
            <IngredientGraph graph={layoutIngredientGraph(ingredient)} />
          </section>
        )}

        {dishes.length > 0 && (
          <section className={"pt-16"}>
            <SectionHeading title={`Every dish with ${ingredient.name.toLowerCase()}`} />
            <div className={"grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5"}>
              {dishes.map((d) => (
                <Link
                  key={d.slug}
                  href={`/dishes/${d.slug}`}
                  className={
                    "flex gap-4 rounded-2xl border border-line p-4 text-ink hover:border-chili"
                  }
                >
                  <DishPhoto
                    file={dishImages[d.slug]}
                    width={240}
                    className={"size-28 flex-none rounded-xl"}
                  />
                  <span className={"min-w-0"}>
                    <span className={"block text-lg font-semibold"}>
                      {d.name}{" "}
                      {d.localName && (
                        <span lang={"zh"} className={"font-cjk font-normal text-ink-3"}>
                          {d.localName.split(" / ")[0]}
                        </span>
                      )}
                    </span>
                    <span className={"mt-1 block text-sm text-ink-3"}>{placeLine(d, 3)}</span>
                    <span className={"mt-2 block text-[15px] leading-normal text-ink-2"}>
                      {d.summary}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {world.length > 0 && (
          <section className={"pt-16"}>
            <SectionHeading
              title={
                dishes.length
                  ? "From around the world"
                  : `Dishes with ${ingredient.name.toLowerCase()}`
              }
              description={`${world.length.toLocaleString("en")} imported ${world.length === 1 ? "dish uses" : "dishes use"} it, recipes first.`}
            />
            <ul className={"grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-5 gap-y-6"}>
              {world.slice(0, WORLD_SHOWN).map((d) => (
                <li key={d.id}>
                  <Link href={worldHref(d.id)} className={"group flex flex-col gap-2 text-ink"}>
                    <DishPhoto
                      file={d.image ?? d.imageUrl}
                      width={320}
                      className={"aspect-[4/3] rounded-[14px]"}
                    />
                    <span className={"font-semibold group-hover:text-chili"}>{d.name}</span>
                    <span className={"-mt-1.5 text-sm text-ink-3"}>
                      {d.countries.slice(0, 2).map(countryName).join(", ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {world.length > WORLD_SHOWN && (
              <Link
                href={`/dishes?ingredient=${ingredient.id}`}
                className={"mt-6 inline-block text-[15px] font-semibold text-chili hover:underline"}
              >
                See all {world.length.toLocaleString("en")}
              </Link>
            )}
          </section>
        )}

        {dishes.length > 0 && (
          <section className={"flex flex-wrap gap-10 pt-16"}>
            <div className={"min-w-0 flex-[1_1_420px]"}>
              <h2 className={"mb-4 font-display text-[26px] font-bold"}>Often paired with</h2>
              <div className={"flex flex-wrap gap-2.5"}>
                {paired.slice(0, 16).map(({ ingredient: other, count }) => (
                  <ChipLink key={other.id} href={`/ingredients/${other.id}`}>
                    {other.name}
                    {count > 1 && <span className={"text-[13px] text-ink-3"}>×{count}</span>}
                  </ChipLink>
                ))}
              </div>
            </div>
            <div className={"min-w-0 flex-[1_1_420px]"}>
              <h2 className={"mb-4 font-display text-[26px] font-bold"}>Where it&apos;s cooked</h2>
              <div className={"flex flex-wrap gap-2.5"}>
                {placeIds.map((id) => (
                  <ChipLink key={id} href={`/places/${id}`} variant={"sand"}>
                    {getPlace(id).name}
                  </ChipLink>
                ))}
              </div>
            </div>
          </section>
        )}
      </Container>
    </main>
  )
}
