# @flavor-db/world-dishes

Dishes and recipes from around the world, imported from openly licensed sources. The hand-curated dishes
in `@flavor-db/seed-data` stay the editorial core; this package is the long tail.

See [`data/STATS.md`](data/STATS.md) for current counts.

## Sources

| Source                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | What it gives us                                                                                                                                                                                       | License                   | Obligations                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Wikidata](https://www.wikidata.org)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | ~20,000 dishes and foods: names (English, Chinese, or the local language), description, countries, cuisines, ingredients, image, Wikipedia links. Drinks, brands and fictional foods are filtered out. | CC0 1.0                   | None. We credit it anyway.                                                                                                                                                           |
| Wikibooks cookbooks in 12 languages: [English](https://en.wikibooks.org/wiki/Cookbook:Table_of_Contents), [Hungarian](https://hu.wikibooks.org/wiki/Szakácskönyv), [French](https://fr.wikibooks.org/wiki/Livre_de_cuisine), [Polish](https://pl.wikibooks.org/wiki/Książka_kucharska), [Spanish](https://es.wikibooks.org/wiki/Artes_culinarias), [Russian](https://ru.wikibooks.org/wiki/Кулинарная_книга), [German](https://de.wikibooks.org/wiki/Kochbuch), [Italian](https://it.wikibooks.org/wiki/Libro_di_cucina), [Dutch](https://nl.wikibooks.org/wiki/Kookboek), [Portuguese](https://pt.wikibooks.org/wiki/Livro_de_receitas), [Japanese](https://ja.wikibooks.org/wiki/料理本), [Chinese](https://zh.wikibooks.org/wiki/食谱) | ~15,000 full recipes (ingredients and steps). English comes from the API; the others from Wikimedia's database dumps.                                                                                  | CC BY-SA 4.0              | Credit the page and its authors (link to the page), state the license, and share changed versions of the text under the same license. Each recipe carries its `source.url` for this. |
| [HowToCook](https://github.com/Anduin2017/HowToCook)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 373 Chinese home-cooking recipes                                                                                                                                                                       | Unlicense (public domain) | None. We credit it anyway.                                                                                                                                                           |

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
pnpm --filter=@flavor-db/world-dishes run fetch       # downloads into .cache/ (resumable; ~1 hour, ~400 MB)
pnpm --filter=@flavor-db/world-dishes run build-data  # rewrites data/*.jsonl and data/STATS.md
```

The fetchers identify themselves with a User-Agent, pause between requests, and back off on errors, as
Wikimedia's API etiquette asks.

## Shape

`data/dishes-NN.jsonl` holds one `WorldDish` (see `src/types.ts`) per line, sorted by id. Wikidata dishes use
their QID as id; recipes that match a Wikidata dish by English or Chinese name are attached to it, and the
rest become dishes with ids like `wikibooks:pad-thai`, `wikibooks-hu:rakott-puliszka-i` or
`howtocook:staple:蛋炒饭`. Recipes keep their original language (`recipe.lang`); nothing is machine-translated.

Data quality follows the sources. Many Wikidata items have no ingredients, some recipes have no country, and
most recipes outside English, French, Spanish and Japanese have no separate list of ingredient names (the
recipe's own ingredient lines are still there).
