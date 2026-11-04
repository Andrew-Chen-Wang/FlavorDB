import { DishCard } from "@website/components/site/dish-card"
import { WorldPreview } from "@website/components/site/world-preview"
import { ChipLink, Container, SectionHeading, Stat, Tag } from "@website/components/site/ui"
import {
  COUNTRY_NAMES,
  HOME_REGIONS,
  countriesOf,
  dishes,
  findDish,
  ingredientUseCount,
  ingredients,
} from "@website/lib/data"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const pick = (slugs: string[]) => slugs.map((s) => findDish(s)).filter((d) => d !== undefined)

export default function Page() {
  const countryCount = new Set(dishes.flatMap(countriesOf)).size
  const zongzi = findDish("zongzi")
  const tamale = findDish("tamale")
  const topIngredients = ingredients
    .map((i) => ({ ingredient: i, n: ingredientUseCount(i.id) }))
    .toSorted((a, b) => b.n - a.n)
    .slice(0, 14)

  return (
    <main>
      <Container className={"flex flex-wrap items-end gap-12 pt-16 pb-10 sm:pt-[72px]"}>
        <div className={"min-w-0 flex-[999_1_560px]"}>
          <p className={"mb-4 text-sm font-semibold tracking-[0.08em] text-chili uppercase"}>
            An atlas of the world&apos;s dishes
          </p>
          <h1
            className={
              "max-w-[14ch] font-display text-[44px] leading-[1.02] font-bold tracking-[-0.025em] sm:text-[clamp(44px,6vw,76px)]"
            }
          >
            Every dish, everywhere it belongs.
          </h1>
          <p className={"mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-2 sm:text-[19px]"}>
            Where each dish came from, where it&apos;s eaten today, how it changes from town to
            town, how to cook it, and the dishes it&apos;s related to. No sides taken in origin
            disputes: a dish lists every place it calls home.
          </p>
        </div>
        <div className={"flex flex-[1_1_300px] gap-8 pb-1.5"}>
          <Stat value={dishes.length} label={"dishes so far"} />
          <Stat value={ingredients.length} label={"ingredients"} />
          <Stat value={countryCount} label={"countries & territories"} />
        </div>
      </Container>

      <Container>
        <form
          role={"search"}
          action={"/dishes"}
          className={"flex flex-wrap gap-3 rounded-[20px] border border-line-strong bg-paper p-3"}
        >
          <label htmlFor={"hero-q"} className={"sr-only"}>
            Search
          </label>
          <input
            aria-label={"Search dishes, ingredients and places"}
            id={"hero-q"}
            name={"q"}
            type={"search"}
            placeholder={"Try “zongzi”, “Sichuan peppercorn” or “Detroit”"}
            className={
              "h-14 min-w-0 flex-[1_1_320px] rounded-xl bg-white px-[18px] text-lg shadow-[inset_0_0_0_1px_#E4DFD3] placeholder:text-ink-3"
            }
          />
          <button
            type={"submit"}
            className={"h-14 rounded-xl bg-ink px-7 font-semibold text-white hover:bg-ink-2"}
          >
            Search
          </button>
        </form>
        <div className={"mt-4 flex flex-wrap items-center gap-2 text-sm"}>
          <span className={"mr-1 text-ink-3"}>Popular:</span>
          {[
            ["/ingredients/lotus-root", "Lotus root"],
            ["/ingredients/sichuan-pepper", "Sichuan peppercorn"],
            ["/places/cn-wuhan", "Wuhan"],
            ["/places/us-detroit", "Detroit"],
            ["/pantry", "What can I make?"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={"rounded-full bg-sand px-3.5 py-2.5 hover:text-chili"}
            >
              {label}
            </Link>
          ))}
        </div>
      </Container>

      <Container className={"pt-16"}>
        <Link
          href={"/map"}
          className={
            "relative block h-[440px] overflow-hidden rounded-[20px] border border-line-strong bg-sea"
          }
        >
          <WorldPreview />
          <div
            className={
              "absolute right-6 bottom-6 left-6 flex flex-wrap items-end justify-between gap-4"
            }
          >
            <div
              className={
                "max-w-[420px] rounded-[14px] bg-white px-[22px] py-[18px] shadow-[0_6px_24px_rgba(27,26,23,0.12)]"
              }
            >
              <div className={"font-display text-2xl font-bold"}>Explore the map</div>
              <div className={"mt-1.5 text-[15px] leading-normal text-ink-2"}>
                Zoom from continents down to cities. Every dish is pinned to every place it belongs.
              </div>
            </div>
            <span
              className={
                "inline-flex min-h-12 items-center gap-2 rounded-full bg-chili px-[22px] text-[15px] font-semibold text-white"
              }
            >
              Open the map <ArrowRight className={"size-[18px]"} aria-hidden />
            </span>
          </div>
        </Link>
      </Container>

      <Container className={"pt-20"}>
        <SectionHeading
          title={"Wuhan, Sichuan & Shangrao"}
          description={
            "Clay-pot soups from Hubei's lakes, the numbing heat of Sichuan, and the rice noodles of Jiangxi."
          }
          link={{ href: "/places/cn-wuhan", label: "More from Wuhan" }}
        />
        <div className={"grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6"}>
          {pick(HOME_REGIONS.central).map((d) => (
            <DishCard key={d.slug} dish={d} />
          ))}
        </div>
      </Container>

      <Container className={"pt-[72px]"}>
        <SectionHeading
          title={"Michigan & New York City"}
          description={
            "Square pizza from Detroit's auto plants, island fudge, Coney dogs, casseroles, and the foldable New York slice."
          }
          link={{ href: "/places/us-michigan", label: "More from Michigan" }}
        />
        <div className={"grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6"}>
          {pick(HOME_REGIONS.michigan).map((d) => (
            <DishCard key={d.slug} dish={d} />
          ))}
        </div>
      </Container>

      {zongzi && tamale && (
        <Container className={"pt-20"}>
          <div className={"flex flex-wrap items-center gap-10 rounded-3xl bg-stone p-6 sm:p-12"}>
            <div className={"min-w-0 flex-[1_1_340px]"}>
              <p className={"mb-3 text-sm font-semibold tracking-[0.08em] text-jade uppercase"}>
                Made the same way
              </p>
              <h2
                className={
                  "font-display text-[34px] leading-tight font-bold tracking-tight sm:text-4xl"
                }
              >
                Half a world apart, wrapped the same way.
              </h2>
              <p className={"mt-4 text-[17px] leading-relaxed text-ink-2"}>
                Every dish links to others that taste alike, and to others built on the same
                fundamentals even when the flavors differ. The tamale and zongzi are both fillings
                wrapped in leaves and cooked in steam or water.
              </p>
            </div>
            <div className={"flex min-w-0 flex-[1_1_520px] flex-wrap items-center gap-4"}>
              {[zongzi, tamale].map((d, i) => (
                <div key={d.slug} className={"contents"}>
                  {i === 1 && (
                    <div className={"flex flex-[0_1_132px] flex-col items-center gap-2"}>
                      {["wrapped", "leaf-wrapped", "stuffed", "steamed"].map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/dishes/${d.slug}`}
                    className={
                      "flex-[1_1_200px] rounded-2xl border border-line bg-white p-3.5 text-ink hover:border-chili"
                    }
                  >
                    <div className={"photo-placeholder aspect-[4/3] rounded-[10px]"} />
                    <div className={"mt-3 text-lg font-semibold"}>
                      {d.name}{" "}
                      <span className={"font-cjk font-normal text-ink-3"}>{d.localName}</span>
                    </div>
                    <div className={"mt-0.5 text-sm text-ink-3"}>
                      {countriesOf(d)
                        .map((c) => COUNTRY_NAMES[c])
                        .join(", ")}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Container>
      )}

      <Container className={"pt-20"}>
        <SectionHeading
          title={"Start from an ingredient"}
          description={"Pick one and see every dish that uses it."}
          link={{ href: "/ingredients", label: `All ${ingredients.length} ingredients` }}
        />
        <div className={"flex flex-wrap gap-2.5"}>
          {topIngredients.map(({ ingredient, n }) => (
            <ChipLink key={ingredient.id} href={`/ingredients/${ingredient.id}`}>
              {ingredient.name}
              <span className={"text-[13px] text-ink-3"}>{n}</span>
            </ChipLink>
          ))}
        </div>
      </Container>
    </main>
  )
}
