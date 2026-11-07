# Recipes on multi-recipe pages

Added **303 recipes across 170 dishes**. The loaded catalog now has **14,622 recipes**; 2 previously recipe-less dishes gain their first recipes.

Models read each source page and each existing recipe. The candidate inventory used repeated section
headings only to choose pages to read; it did not decide which sections were recipes. Readers rejected
component fillings, sauces, optional substitutions, already imported methods and differently named
dishes. Incomplete variants stay pending, with reasons in `decisions.jsonl`.

The five requested example pages were read in full: Brigadeiro gains Receitas 2–9, Castagnaccio its
second Italian recipe, Bacalhau à Brás its second Portuguese recipe, Sárga túró its sweet ten-egg recipe,
and dashi its bonito, niboshi, awase and instant methods. Readers also checked 247 additional candidate
pages. A second reader checked 48 proposals, withheld four incomplete methods and restored source
section labels where a flattened ingredient list would make “mix everything above” ambiguous.

`additions.jsonl` records literal recipes with reasons and source evidence. `decisions.jsonl` records
every candidate decision. Source quantities and language are retained, including documented source
inconsistencies; missing quantities or operations were never invented. Every recipe retains its
Wikibooks URL and CC BY-SA 4.0 attribution. Complete source revisions recovered beyond the old
6,000-character excerpts are recorded separately.

`data/additional-recipes.json` is keyed by dish ID, and the loader appends those recipes before mapping
ingredients. This preserves the original reviewed shards and application receipt. The same function
runs after the verdict application in `build-data`, so a future full rebuild retains these additions.
It deduplicates by source URL, language and title, allowing several alternatives from one page and
throwing on conflicting content. The page's React key uses all three fields too.

The import cache was not available for a full `build-data` run. The checked-in overlay was applied at
load time and tested for idempotence instead. Remaining work includes sources whose own methods are
incomplete, distinct dishes found on another dish's page, missing component detail in previously
imported recipes, and multi-recipe pages outside this structural candidate inventory. Newly recovered
ingredient text has not received a separate complete ingredient-mapping reading.

Full official pages were fetched and read for nine truncated cases. This recovered 25 more recipes, including Hallaca preparations, Bolo de fubá9 and cookie-dough variants. Revision IDs and source hashes are committed alongside the complete raw text. Esfirra7 remains incomplete even in its full source.
