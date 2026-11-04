const features = [
  {
    title: "A little history",
    body: "Where each dish came from and how it developed.",
  },
  {
    title: "Where it can be found",
    body: "Every region and country a dish belongs to. Flavor DB doesn't take sides in origin disputes.",
  },
  {
    title: "Local variations",
    body: "How a dish changes from place to place.",
  },
  {
    title: "Recipes",
    body: "One or more recipes where available, and at least the ingredients when not.",
  },
  {
    title: "Similar dishes",
    body: "Linked by flavor profile and by recipe fundamentals, like the tamale and zongzi.",
  },
  {
    title: "Ingredient graph",
    body: "Pick an ingredient and see every recipe that uses it.",
  },
]

export default function Page() {
  return (
    <main className={"container py-16 sm:py-24"}>
      <header className={"max-w-2xl"}>
        <h1 className={"text-4xl font-semibold tracking-tight sm:text-5xl"}>Flavor DB</h1>
        <p className={"mt-4 text-lg text-muted-foreground"}>
          A showcase of the world&apos;s dishes, as completely as possible, along with their local
          variations.
        </p>
      </header>
      <ul className={"mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
        {features.map((feature) => (
          <li key={feature.title} className={"rounded-lg border p-6"}>
            <h2 className={"font-medium"}>{feature.title}</h2>
            <p className={"mt-2 text-sm text-muted-foreground"}>{feature.body}</p>
          </li>
        ))}
      </ul>
      <p className={"mt-12 text-sm text-muted-foreground"}>Coming soon.</p>
    </main>
  )
}
