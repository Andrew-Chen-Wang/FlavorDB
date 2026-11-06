import { Breadcrumb, ChipLink, Container, SectionHeading } from "@website/components/site/ui"
import { type WorldDish, commonsPage, commonsThumb, countryName } from "@website/lib/world"
import type { WorldRecipe } from "@flavor-db/world-dishes"
import Link from "next/link"

const LICENSE_NAMES: Record<string, { label: string; url: string }> = {
  "CC0-1.0": { label: "CC0 1.0", url: "https://creativecommons.org/publicdomain/zero/1.0/" },
  "CC-BY-SA-4.0": { label: "CC BY-SA 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/" },
  Unlicense: { label: "Unlicense (public domain)", url: "https://unlicense.org/" },
}

/** The page for an imported dish. */
export function WorldDishView({ dish }: { dish: WorldDish }) {
  const zh = dish.names.zh && dish.names.zh !== dish.name ? dish.names.zh : undefined

  return (
    <main>
      <Container>
        <Breadcrumb items={[{ href: "/dishes", label: "Dishes" }, { label: dish.name }]} />
        <section className={"flex flex-wrap gap-12 pt-7"}>
          <div className={"min-w-0 flex-[999_1_520px]"}>
            {dish.kinds.length > 0 && (
              <div className={"flex flex-wrap gap-2"}>
                {dish.kinds.slice(0, 4).map((k) => (
                  <span
                    key={k}
                    className={"rounded-full bg-sand px-3 py-1.5 text-[13px] font-medium"}
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
            <h1
              className={
                "mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1.5 font-display text-5xl leading-[1.05] font-bold tracking-[-0.025em] sm:text-[60px]"
              }
            >
              {dish.name}
              {zh && (
                <span
                  lang={"zh"}
                  className={"font-cjk text-3xl font-medium tracking-normal text-ink-3 sm:text-4xl"}
                >
                  {zh}
                </span>
              )}
            </h1>
            {dish.description && (
              <p
                className={
                  "mt-4 max-w-[60ch] text-lg leading-relaxed text-ink-2 first-letter:uppercase sm:text-xl"
                }
              >
                {dish.description}
              </p>
            )}
            {dish.countries.length > 0 && (
              <div className={"mt-6"}>
                <h2
                  className={
                    "mb-2.5 text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"
                  }
                >
                  Where it belongs
                </h2>
                <div className={"flex flex-wrap gap-2"}>
                  {dish.countries.map((c) => (
                    <ChipLink key={c} href={`/dishes?country=${c}`} variant={"sand"}>
                      {countryName(c)}
                    </ChipLink>
                  ))}
                </div>
              </div>
            )}
            {dish.cuisines.length > 0 && (
              <p className={"mt-4 text-[15px] text-ink-3"}>Cuisine: {dish.cuisines.join(", ")}</p>
            )}
          </div>
          {(dish.image ?? dish.imageUrl) && (
            <figure className={"min-w-0 flex-[1_1_360px]"}>
              {/* oxlint-disable-next-line nextjs/no-img-element -- Commons thumbnails, sized by URL */}
              <img
                src={dish.image ? commonsThumb(dish.image, 800) : dish.imageUrl}
                alt={dish.name}
                className={"aspect-[4/3] w-full rounded-[20px] object-cover"}
              />
              <figcaption className={"mt-2 text-[13px] text-ink-3"}>
                {dish.image ? (
                  <>
                    Photo:{" "}
                    <a
                      href={commonsPage(dish.image)}
                      className={"underline underline-offset-2 hover:text-chili"}
                    >
                      Wikimedia Commons
                    </a>{" "}
                    {dish.imageCredit ? (
                      <>
                        · {dish.imageCredit.author} ·{" "}
                        {dish.imageCredit.licenseUrl ? (
                          <a
                            href={dish.imageCredit.licenseUrl}
                            className={"underline underline-offset-2 hover:text-chili"}
                          >
                            {dish.imageCredit.license}
                          </a>
                        ) : (
                          dish.imageCredit.license
                        )}
                      </>
                    ) : (
                      "(see the file page for author and license)"
                    )}
                  </>
                ) : (
                  <>
                    Photo:{" "}
                    <a
                      href={dish.imageFrom ?? "https://github.com/Anduin2017/HowToCook"}
                      className={"underline underline-offset-2 hover:text-chili"}
                    >
                      HowToCook
                    </a>{" "}
                    (Unlicense, public domain)
                  </>
                )}
              </figcaption>
            </figure>
          )}
        </section>

        {dish.ingredients.length > 0 && (
          <section className={"pt-14"}>
            <SectionHeading title={"Ingredients"} />
            <div className={"flex flex-wrap gap-2.5"}>
              {dish.ingredients.map((i) => (
                <Link
                  key={i}
                  href={`/dishes?q=${encodeURIComponent(i)}`}
                  className={
                    "inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-[15px] hover:text-chili"
                  }
                >
                  {i}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className={"pt-14"}>
          <SectionHeading title={dish.recipes.length > 1 ? "Recipes" : "Recipe"} />
          {dish.recipes.length === 0 ? (
            <p
              className={
                "rounded-2xl border border-dashed border-line-strong bg-paper p-6 text-ink-2"
              }
            >
              No recipe yet. Know how it&apos;s made? Add one.
            </p>
          ) : (
            <WorldRecipes recipes={dish.recipes} />
          )}
        </section>

        <section className={"pt-14 text-sm text-ink-3"}>
          <h2 className={"mb-2 text-[13px] font-semibold tracking-[0.08em] uppercase"}>Sources</h2>
          <ul className={"flex flex-col gap-1"}>
            {dish.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} className={"underline underline-offset-2 hover:text-chili"}>
                  {s.name}
                </a>{" "}
                · {LICENSE_NAMES[s.license]?.label ?? s.license}
              </li>
            ))}
            {Object.entries(dish.wikipedia).map(([lang, url]) => (
              <li key={url}>
                <a href={url} className={"underline underline-offset-2 hover:text-chili"}>
                  Wikipedia ({lang})
                </a>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  )
}

/** Recipes from the imported sources, each with its attribution. */
export function WorldRecipes({ recipes }: { recipes: WorldRecipe[] }) {
  return (
    <div className={"flex flex-col gap-8"}>
      {recipes.map((r) => {
        const license = LICENSE_NAMES[r.source.license]
        return (
          <article
            key={r.source.url}
            lang={r.lang}
            className={"flex flex-wrap gap-10 rounded-[20px] border border-line p-6 sm:p-8"}
          >
            <div className={"min-w-0 flex-[1_1_300px]"}>
              <h3 className={"text-2xl font-semibold"}>{r.title}</h3>
              {r.serves && <p className={"mt-2 text-sm text-ink-2"}>Serves {r.serves}</p>}
              <h4
                className={
                  "mt-6 mb-3 text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"
                }
              >
                Ingredients
              </h4>
              <ul>
                {r.ingredients.map((i, n) => (
                  <li
                    key={`${i.item}-${n}`}
                    className={"flex gap-3 border-b border-[#EEEAE0] py-2.5 text-[15px]"}
                  >
                    {i.amount && <span className={"font-semibold"}>{i.amount}</span>}
                    <span>{i.item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={"min-w-0 flex-[999_1_440px]"}>
              <h4
                className={"mb-3 text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"}
              >
                Method
              </h4>
              <ol className={"flex flex-col gap-4"}>
                {r.steps.map((step, n) => (
                  <li key={`${n}-${step.slice(0, 20)}`} className={"flex gap-4"}>
                    <span
                      className={
                        "flex size-8 flex-none items-center justify-center rounded-full bg-ink text-sm font-semibold text-white"
                      }
                    >
                      {n + 1}
                    </span>
                    <p className={"mt-1 text-[17px] leading-relaxed"}>{step}</p>
                  </li>
                ))}
              </ol>
              <p className={"mt-6 text-[13px] text-ink-3"}>
                From{" "}
                <a href={r.source.url} className={"underline underline-offset-2 hover:text-chili"}>
                  {r.source.name}
                </a>
                {license && (
                  <>
                    , licensed under{" "}
                    <a
                      href={license.url}
                      className={"underline underline-offset-2 hover:text-chili"}
                    >
                      {license.label}
                    </a>
                  </>
                )}
                {r.source.license === "CC-BY-SA-4.0" &&
                  ". Formatting adapted by FlavorDB; see the page history for authors"}
                .
              </p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
