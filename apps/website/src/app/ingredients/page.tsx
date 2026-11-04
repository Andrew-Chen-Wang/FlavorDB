import { Container } from "@website/components/site/ui"
import { ingredientUseCount, ingredients } from "@website/lib/data"
import type { IngredientCategory } from "@flavor-db/seed-data"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Ingredients" }

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  protein: "Meat & eggs",
  seafood: "Fish & seafood",
  vegetable: "Vegetables",
  fruit: "Fruit",
  grain: "Grains, noodles & starches",
  legume: "Beans, tofu & nuts",
  dairy: "Dairy",
  spice: "Spices",
  herb: "Herbs",
  sauce: "Sauces & condiments",
  fat: "Fats & oils",
  sweetener: "Sweeteners",
  other: "Other",
}

export default function IngredientsPage() {
  const groups = (Object.keys(CATEGORY_LABELS) as IngredientCategory[])
    .map((category) => ({
      category,
      items: ingredients
        .filter((i) => i.category === category)
        .map((i) => ({ ingredient: i, n: ingredientUseCount(i.id) }))
        .filter((i) => i.n > 0)
        .toSorted((a, b) => b.n - a.n || a.ingredient.name.localeCompare(b.ingredient.name)),
    }))
    .filter((g) => g.items.length)

  return (
    <main>
      <Container className={"pt-10"}>
        <h1 className={"font-display text-[52px] font-bold tracking-[-0.025em]"}>Ingredients</h1>
        <p className={"mt-2 max-w-[62ch] text-[17px] text-ink-2"}>
          Every ingredient links to every dish that uses it, and to the ingredients it&apos;s cooked
          with.
        </p>
        <div
          className={"mt-10 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-x-10 gap-y-10"}
        >
          {groups.map((g) => (
            <section key={g.category}>
              <h2 className={"mb-3 border-b border-line pb-2 font-display text-xl font-bold"}>
                {CATEGORY_LABELS[g.category]}
              </h2>
              <ul className={"flex flex-col"}>
                {g.items.map(({ ingredient, n }) => (
                  <li key={ingredient.id}>
                    <Link
                      href={`/ingredients/${ingredient.id}`}
                      className={
                        "flex min-h-10 items-center justify-between gap-3 text-[15px] hover:text-chili"
                      }
                    >
                      <span>
                        {ingredient.name}
                        {ingredient.aliases?.some((a) => /\p{Script=Han}/u.test(a)) && (
                          <span lang={"zh"} className={"ml-2 font-cjk text-ink-3"}>
                            {ingredient.aliases.find((a) => /\p{Script=Han}/u.test(a))}
                          </span>
                        )}
                      </span>
                      <span className={"text-[13px] text-ink-3"}>{n}</span>
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
