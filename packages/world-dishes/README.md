# @flavor-db/world-dishes

Dishes and recipes from around the world, imported from openly licensed sources. The hand-curated dishes
in `@flavor-db/seed-data` stay the editorial core; this package is the long tail.

See [`data/STATS.md`](data/STATS.md) for current counts.

## Sources

| Source                                                                         | What it gives us                                                                                                                                           | License                   | Obligations                                                                                                                                                                          |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Wikidata](https://www.wikidata.org)                                           | ~30,000 dishes and foods tied to a country or cuisine: names in English and Chinese, description, countries, cuisines, ingredients, image, Wikipedia links | CC0 1.0                   | None. We credit it anyway.                                                                                                                                                           |
| [Wikibooks Cookbook](https://en.wikibooks.org/wiki/Cookbook:Table_of_Contents) | Full recipes (ingredients and steps) in English                                                                                                            | CC BY-SA 4.0              | Credit the page and its authors (link to the page), state the license, and share changed versions of the text under the same license. Each recipe carries its `source.url` for this. |
| [HowToCook](https://github.com/Anduin2017/HowToCook)                           | Full Chinese home-cooking recipes                                                                                                                          | Unlicense (public domain) | None. We credit it anyway.                                                                                                                                                           |

Every dish and recipe records its `sources`, with URL and license, so the website can show attribution next
to the content.

### Sources we don't use

- **Baidu Baike (百度百科)**: its terms of service forbid copying its content, and it blocks automated access.
  Chinese names and dishes come from Wikidata, Chinese Wikipedia links and HowToCook instead.
- **Restaurant menus**: menus give dish names but not recipes, and copying them in bulk would mean scraping
  sites whose terms usually forbid it. Better: let restaurants and users submit dishes.
- **Recipe1M, RecipeNLG and similar scraped datasets**: licensed for non-commercial research only.

## Updating

```bash
pnpm --filter=@flavor-db/world-dishes run fetch       # downloads into .cache/ (resumable; ~40 minutes)
pnpm --filter=@flavor-db/world-dishes run build-data  # rewrites data/*.jsonl and data/STATS.md
```

The fetchers identify themselves with a User-Agent, pause between requests, and back off on errors, as
Wikimedia's API etiquette asks.

## Shape

`data/dishes-NN.jsonl` holds one `WorldDish` (see `src/types.ts`) per line, sorted by id. Wikidata dishes use
their QID as id; recipes that match a Wikidata dish by English or Chinese name are attached to it, and the
rest become dishes with ids like `wikibooks:pad-thai` or `howtocook:staple:蛋炒饭`.

Data quality follows the sources. Many Wikidata items have no ingredients, some recipes have no country, and
HowToCook's ingredient names are in Chinese.
