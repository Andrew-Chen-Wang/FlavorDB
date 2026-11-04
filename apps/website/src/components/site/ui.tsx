import { cn } from "@website/lib/utils"
import Link from "next/link"

export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("mx-auto max-w-[1240px] px-4 sm:px-8", className)}>{children}</div>
}

export function SectionHeading({
  title,
  description,
  link,
  as: Tag = "h2",
}: {
  title: string
  description?: string
  link?: { href: string; label: string }
  as?: "h2" | "h3"
}) {
  return (
    <div className={"mb-6"}>
      <div className={"flex flex-wrap items-baseline justify-between gap-3"}>
        <Tag className={"font-display text-[30px] font-bold tracking-tight sm:text-[34px]"}>
          {title}
        </Tag>
        {link && (
          <Link
            href={link.href}
            className={"py-3 text-[15px] font-semibold text-chili hover:text-chili-dark"}
          >
            {link.label}
          </Link>
        )}
      </div>
      {description && <p className={"mt-2 max-w-[64ch] text-base text-ink-3"}>{description}</p>}
    </div>
  )
}

export function Eyebrow({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <p
      className={cn("text-[13px] font-semibold tracking-[0.08em] text-ink-3 uppercase", className)}
    >
      {children}
    </p>
  )
}

export function ChipLink({
  href,
  children,
  variant = "outline",
}: {
  href: string
  children: React.ReactNode
  variant?: "outline" | "sand"
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 rounded-full px-4 text-[15px] text-ink hover:text-chili",
        variant === "outline" ? "border border-line-strong bg-white" : "bg-sand",
      )}
    >
      {children}
    </Link>
  )
}

export function Tag({
  tone = "jade",
  children,
}: {
  tone?: "jade" | "chili" | "sand"
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs",
        tone === "jade" && "bg-jade-soft text-jade-dark",
        tone === "chili" && "bg-chili-soft text-chili-dark",
        tone === "sand" && "bg-sand text-ink",
      )}
    >
      {children}
    </span>
  )
}

export function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <div className={"font-display text-[40px] font-bold"}>{value}</div>
      <div className={"text-sm text-ink-3"}>{label}</div>
    </div>
  )
}

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label={"Breadcrumb"} className={"flex flex-wrap gap-2 pt-5 text-sm text-ink-3"}>
      {items.map((item, i) => (
        <span key={item.label} className={"flex gap-2"}>
          {i > 0 && <span aria-hidden>/</span>}
          {item.href ? (
            <Link href={item.href} className={"hover:text-chili"}>
              {item.label}
            </Link>
          ) : (
            <span className={"text-ink"}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
