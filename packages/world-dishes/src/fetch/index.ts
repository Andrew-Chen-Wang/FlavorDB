import { fetchHowToCook } from "./howtocook"
import { fetchWikibooks } from "./wikibooks"
import { fetchWikidata } from "./wikidata"

fetchHowToCook()
await fetchWikidata()
await fetchWikibooks()
console.log("Fetched everything into .cache/. Run `pnpm run build-data` next.")
