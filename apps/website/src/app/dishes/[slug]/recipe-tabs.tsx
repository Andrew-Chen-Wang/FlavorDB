"use client"

import type { Recipe } from "@flavor-db/seed-data"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import { useState } from "react"

type NamedRecipe = Omit<Recipe, "ingredients"> & {
  ingredients: (Recipe["ingredients"][number] & { name: string })[]
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${m} min` : `${h} ${h === 1 ? "hour" : "hours"}`
}

export function RecipeTabs({
  dishName,
  recipes,
  fallbackIngredients,
}: {
  dishName: string
  recipes: NamedRecipe[]
  fallbackIngredients: { id: string; name: string }[]
}) {
  const [active, setActive] = useState(0)

  if (recipes.length === 0) {
    return (
      <div className={"rounded-[20px] border border-dashed border-[#C9C2B2] bg-paper p-8"}>
        <h3 className={"text-[22px] font-semibold"}>No recipe for {dishName.toLowerCase()} yet</h3>
        <p className={"mt-2 mb-5 max-w-[60ch] text-base text-ink-2"}>
          Here&apos;s what goes into it. Know how it&apos;s made? Add the recipe.
        </p>
        <div className={"flex flex-wrap gap-2"}>
          {fallbackIngredients.map((i) => (
            <Link
              key={i.id}
              href={`/ingredients/${i.id}`}
              className={
                "rounded-full border border-line-strong bg-white px-3.5 py-2.5 text-[15px] hover:text-chili"
              }
            >
              {i.name}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const recipe = recipes[active] ?? recipes[0]
  return (
    <div>
      {recipes.length > 1 && (
        <div role={"tablist"} aria-label={"Recipes"} className={"mb-6 flex flex-wrap gap-2"}>
          {recipes.map((r, i) => (
            <button
              key={r.title}
              type={"button"}
              role={"tab"}
              aria-selected={i === active}
              onClick={() => {
                setActive(i)
              }}
              className={cn(
                "min-h-11 rounded-full border px-[18px] text-[15px] font-medium",
                i === active ? "border-ink bg-ink text-white" : "border-line-strong bg-white",
              )}
            >
              {r.title}
            </button>
          ))}
        </div>
      )}
      <div
        role={recipes.length > 1 ? "tabpanel" : undefined}
        className={"flex flex-wrap gap-10 rounded-[20px] border border-line p-6 sm:p-8"}
      >
        <div className={"min-w-0 flex-[1_1_320px]"}>
          <h3 className={"text-2xl font-semibold"}>{recipe.title}</h3>
          <div className={"mt-3 flex flex-wrap gap-5 text-sm text-ink-2"}>
            <span>Serves {recipe.serves}</span>
            <span>{formatMinutes(recipe.minutes)}</span>
          </div>
          <h4
            className={"mt-7 mb-3 text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"}
          >
            Ingredients
          </h4>
          <ul>
            {recipe.ingredients.map((i) => (
              <li
                key={i.ingredientId}
                className={
                  "grid grid-cols-[120px_1fr] gap-3 border-b border-[#EEEAE0] py-2.5 text-[15px]"
                }
              >
                <span className={"font-semibold"}>{i.amount}</span>
                <span>
                  <Link
                    href={`/ingredients/${i.ingredientId}`}
                    className={
                      "underline decoration-line-strong underline-offset-[3px] hover:text-chili"
                    }
                  >
                    {i.name}
                  </Link>
                  {i.note && <span className={"text-ink-3"}>, {i.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={"min-w-0 flex-[999_1_460px]"}>
          <h4 className={"mb-3 text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase"}>
            Method
          </h4>
          <ol className={"flex flex-col gap-5"}>
            {recipe.steps.map((step, i) => (
              <li key={step} className={"flex gap-4"}>
                <span
                  className={
                    "flex size-8 flex-none items-center justify-center rounded-full bg-ink text-sm font-semibold text-white"
                  }
                >
                  {i + 1}
                </span>
                <p className={"mt-1 text-[17px] leading-relaxed"}>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
