import type { Dish } from "@website/lib/data"
import { dishImages } from "@flavor-db/seed-data"
import { placeLine } from "@website/lib/data"
import { cn } from "@website/lib/utils"
import Link from "next/link"
import { DishPhoto } from "./dish-photo"

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
      <DishPhoto file={dishImages[dish.slug]} width={480} className={"aspect-[4/3] rounded-[14px]"}>
        {dish.recipes.length > 0 && (
          <span
            className={
              "absolute top-2.5 left-2.5 rounded-md bg-white px-2 py-1 text-xs font-semibold text-jade-dark"
            }
          >
            Recipe
          </span>
        )}
      </DishPhoto>
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
  href,
  image,
  aside,
  children,
}: {
  dish: Pick<Dish, "name" | "localName"> & { slug?: string }
  /** Defaults to the dish's own page */
  href?: string
  /** A Commons file; defaults to the hand-written dish's photo */
  image?: string
  aside?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <Link
      href={href ?? `/dishes/${dish.slug}`}
      className={"-mx-2.5 flex items-center gap-3.5 rounded-xl p-2.5 text-ink hover:bg-paper"}
    >
      <DishPhoto
        file={image ?? (dish.slug ? dishImages[dish.slug] : undefined)}
        width={120}
        className={"size-14 flex-none rounded-[10px]"}
      />
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
