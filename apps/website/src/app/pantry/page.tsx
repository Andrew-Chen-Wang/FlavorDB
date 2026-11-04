import { Container } from "@website/components/site/ui"
import { STAPLE_INGREDIENTS, dishes, ingredientUseCount, ingredients } from "@website/lib/data"
import type { Metadata } from "next"
import { Pantry, type PantryData } from "./pantry"

export const metadata: Metadata = {
  title: "What can I make?",
  description:
    "Enter the ingredients you have and see the dishes you can cook now, or with one or two more.",
}

const QUICK_ADD: [string, string[]][] = [
  [
    "Sauces & seasonings",
    [
      "soy-sauce",
      "dark-soy-sauce",
      "shaoxing-wine",
      "sesame-oil",
      "chili-oil",
      "doubanjiang",
      "sichuan-pepper",
      "star-anise",
      "black-vinegar",
      "oyster-sauce",
      "ketchup",
      "mustard",
    ],
  ],
  [
    "Meat, fish & tofu",
    [
      "pork-belly",
      "ground-pork",
      "pork-ribs",
      "chicken",
      "beef",
      "ground-beef",
      "shrimp",
      "tofu",
      "egg",
    ],
  ],
  [
    "Produce",
    [
      "green-onion",
      "ginger",
      "garlic",
      "onion",
      "lotus-root",
      "napa-cabbage",
      "celery",
      "tomato",
      "potato",
      "cilantro",
    ],
  ],
  [
    "Pantry",
    [
      "rice",
      "glutinous-rice",
      "flour",
      "rice-noodles",
      "wheat-noodles",
      "cornstarch",
      "sugar",
      "rock-sugar",
      "butter",
      "milk",
      "peanuts",
    ],
  ],
]

export default function PantryPage() {
  const data: PantryData = {
    dishes: dishes.map((d) => ({
      slug: d.slug,
      name: d.name,
      localName: d.localName?.split(" / ")[0] ?? "",
      ingredients: d.ingredients,
      hasRecipe: d.recipes.length > 0,
    })),
    ingredients: ingredients
      .filter((i) => ingredientUseCount(i.id) > 0)
      .map((i) => ({ id: i.id, name: i.name, aliases: i.aliases ?? [] })),
    staples: [...STAPLE_INGREDIENTS],
    quickAdd: QUICK_ADD.map(([title, ids]) => ({ title, ids })),
  }
  return (
    <main>
      <Container className={"pt-10"}>
        <h1
          className={
            "font-display text-[44px] leading-[1.05] font-bold tracking-[-0.025em] sm:text-[52px]"
          }
        >
          What can I make?
        </h1>
        <p className={"mt-2.5 max-w-[62ch] text-lg text-ink-2"}>
          Tell us what&apos;s in your kitchen. We&apos;ll show what you can cook right now, then
          what you could cook with one more ingredient, then two.
        </p>
        <Pantry data={data} />
      </Container>
    </main>
  )
}
