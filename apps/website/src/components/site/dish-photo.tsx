import { cn } from "@website/lib/utils"

/** A Commons thumbnail, sized by URL. */
export const commonsThumb = (file: string, width = 480) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`

/** A dish photo from Wikimedia Commons, over a placeholder pattern while it loads or when there's none. */
export function DishPhoto({
  file,
  width,
  className,
  children,
}: {
  file?: string
  width: number
  className?: string
  children?: React.ReactNode
}) {
  return (
    <span className={cn("photo-placeholder relative block overflow-hidden", className)}>
      {file && (
        // oxlint-disable-next-line nextjs/no-img-element -- Commons thumbnails, sized by URL
        <img
          src={commonsThumb(file, width)}
          alt={""}
          loading={"lazy"}
          className={"absolute inset-0 h-full w-full object-cover"}
        />
      )}
      {children}
    </span>
  )
}
