import { DishRow } from "@website/components/site/dish-card"
import { SectionHeading, Tag } from "@website/components/site/ui"
import type { similarDishes } from "@website/lib/data"
import { findWorldDish } from "@website/lib/world"

export function SimilarDishes({ similar }: { similar: ReturnType<typeof similarDishes> }) {
  return (
    <section id={"similar"} className={"scroll-mt-4 pt-[72px]"}>
      <SectionHeading title={"Similar dishes"} />
      <div className={"flex flex-wrap gap-6"}>
        {(
          [
            [
              "Made the same way",
              "Looks alike on the table and goes through the same process (stir-fried, boiled and tossed, simmered…), from any cuisine, whatever the flavor.",
              similar.byTechnique,
              "jade",
            ],
            [
              "Tastes alike",
              "Built on the same main ingredient (noodles, rice, pork…), with similar basic tastes (sweet, salty, sour, umami, heat, numbing) and shared flavors.",
              similar.byFlavor,
              "chili",
            ],
          ] as const
        ).map(([title, description, list, tone]) => (
          <div
            key={title}
            className={"min-w-0 flex-[1_1_440px] rounded-[20px] border border-line p-7"}
          >
            <h3 className={"text-xl font-semibold"}>{title}</h3>
            <p className={"mt-1.5 mb-5 text-[15px] text-ink-3"}>{description}</p>
            <ul className={"flex flex-col gap-1"}>
              {list.map(({ key, href, name, localName, subtitle, score, why, worldId }) => (
                <li key={key}>
                  <DishRow
                    dish={{ slug: worldId ? undefined : key, name, localName }}
                    href={href}
                    image={worldId ? findWorldDish(worldId)?.image : undefined}
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
                    <span className={"mt-0.5 block text-[13px] text-ink-3"}>{subtitle}</span>
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
  )
}
