import { catalogEntries } from "./catalog"
import { dishes, dishesForPlace, places } from "./data"
import { worldIndex, countryName } from "./world"
import locations from "./country-locations.json"

export function catalogMapData() {
  const entries = catalogEntries()
  const curated = new Map(dishes.map((d) => [d.slug, d]))
  const imported = new Map(worldIndex().map(({ dish }) => [dish.id, dish]))
  const byCountry = new Map<string, string[]>()
  for (const e of entries)
    for (const code of e.countries) {
      const group = byCountry.get(code) ?? []
      group.push(e.key)
      byCountry.set(code, group)
    }
  const countries = [...byCountry].flatMap(([code, keys]) => {
    const location = (
      locations as Record<
        string,
        { lat: number; lng: number; capitals: { name: string; lat: number; lng: number }[] }
      >
    )[code]
    return location
      ? [{ code, name: countryName(code), lng: location.lng, lat: location.lat, dishes: keys }]
      : []
  })
  const localPlaces = places
    .filter((p) => p.kind !== "country")
    .map((p) => ({
      id: p.id,
      name: p.name,
      lng: p.lng,
      lat: p.lat,
      dishes: dishesForPlace(p).map((d) => d.slug),
    }))
    .filter((p) => p.dishes.length)
  const placeCountries = new Map(places.map((p) => [p.id, p.country]))
  const capitalAnchors = new Map<string, string>()
  const capitalPins = countries.flatMap((c) => {
    const keys = c.dishes.filter((key) => {
      const d = curated.get(key)
      return (
        !d ||
        !d.places.some(
          (p) =>
            placeCountries.get(p.placeId) === c.code &&
            localPlaces.some((place) => place.id === p.placeId),
        )
      )
    })
    if (!keys.length) return []
    const location = (
      locations as Record<string, { capitals: { name: string; lat: number; lng: number }[] }>
    )[c.code]
    // Where there is no recorded capital, retain the country pin rather than invent a city.
    const capital = location.capitals[0]
    const existing =
      capital &&
      localPlaces.find(
        (p) =>
          placeCountries.get(p.id) === c.code &&
          Math.abs(p.lat - capital.lat) < 0.15 &&
          Math.abs(p.lng - capital.lng) < 0.15,
      )
    if (existing) {
      existing.name = `${existing.name} · ${c.name} (local and country-level dishes)`
      existing.dishes = [...new Set([...existing.dishes, ...keys])]
      capitalAnchors.set(c.code, existing.id)
      return []
    }
    capitalAnchors.set(c.code, `country-${c.code}`)
    return [
      {
        id: `country-${c.code}`,
        name: capital
          ? `${capital.name} · ${c.name} (country-level dishes)`
          : `${c.name} (country-level dishes)`,
        lng: capital?.lng ?? c.lng,
        lat: capital?.lat ?? c.lat,
        dishes: keys,
      },
    ]
  })
  return {
    dishes: entries.map((e) => ({
      slug: e.key,
      name: e.name,
      image: e.image,
      localName: e.localName ?? "",
      category: curated.get(e.key)?.category ?? imported.get(e.key)?.kinds[0] ?? "other",
      placeLine: e.countries.map(countryName).join(" / "),
    })),
    countries,
    places: [...localPlaces, ...capitalPins],
    placeDishOrigins: Object.fromEntries(
      entries.map((e) => {
        const d = curated.get(e.key)
        return [
          e.key,
          d?.places.some((p) => localPlaces.some((place) => place.id === p.placeId))
            ? d.places
                .filter((p) => localPlaces.some((place) => place.id === p.placeId))
                .map((p) => p.placeId)
            : [capitalAnchors.get(e.countries[0]) ?? `country-${e.countries[0]}`],
        ]
      }),
    ),
  }
}
