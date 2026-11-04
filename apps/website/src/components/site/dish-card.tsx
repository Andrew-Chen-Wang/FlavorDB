import type { Dish } from "@website/lib/data"
import { placeLine } from "@website/lib/data"
import { cn } from "@website/lib/utils"
import Link from "next/link"

export function DishCard({
  dish,
  subtitle,
  className,
}: {
  dish: Dish
  subtitle?: string
  className?: string
}) {
  return (
    <Link
      href={`/dishes/${dish.slug}`}
      className={cn("group flex flex-col gap-2.5 text-ink", className)}
    >
      <span className={"photo-placeholder relative block aspect-[4/3] rounded-[14px]"}>
        {dish.recipes.length > 0 && (
          <span
            className={
              "absolute top-2.5 left-2.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-jade-dark"
            }
          >
            Recipe
          </span>
        )}
      </span>
      <span>
        <span className={"flex flex-wrap items-baseline gap-x-2"}>
          <span className={"text-base font-semibold group-hover:text-chili"}>{dish.name}</span>
          {dish.localName && (
            <span lang={"zh"} className={"font-cjk text-sm text-ink-3"}>
              {dish.localName.split(" / ")[0]}
            </span>
          )}
        </span>
        <span className={"mt-1 block text-sm text-ink-3"}>{subtitle ?? placeLine(dish)}</span>
      </span>
    </Link>
  )
}

export function DishRow({
  dish,
  aside,
  children,
}: {
  dish: Dish
  aside?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <Link
      href={`/dishes/${dish.slug}`}
      className={"-mx-2.5 flex items-center gap-3.5 rounded-xl p-2.5 text-ink hover:bg-paper"}
    >
      <span className={"photo-placeholder size-14 flex-none rounded-[10px]"} />
      <span className={"min-w-0 flex-1"}>
        <span className={"block font-semibold"}>
          {dish.name}{" "}
          {dish.localName && (
            <span lang={"zh"} className={"font-cjk font-normal text-ink-3"}>
              {dish.localName.split(" / ")[0]}
            </span>
          )}
        </span>
        {children}
      </span>
      {aside}
    </Link>
  )
}
