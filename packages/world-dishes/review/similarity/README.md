# Recipe-backed similarity profiles

300 imported dishes were read individually, including all 434 supplied recipes, names and descriptions.
279 receive new profiles; 21 are deferred because of duplicate identities, incompatible recipe/name
merges or insufficient support. The original hand-profiled noodle collection remains in the pool.
No pageview data was available: selection prioritizes recipe-backed, described dishes with source
coverage, not claimed popularity. `selection.json` records the exact selection, exclusions and hashes.

Ten `NN.jsonl` files preserve literal reader proposals. The accompanying `NN-notes.md` files give
per-dish evidence, variant assumptions, uncertainties and proposed vocabulary. A separate reader
reread all 285 proposals and all ten notes files to reconcile vocabulary; `parent-resolutions.json`
records six additional identity deferrals and five profile corrections. `taxonomy.md` explains the
explicit synonym decisions. Application scripts only serialize these literal decisions.

`world-links-imported.ts` contains the 279 accepted profiles. The form/base graphs add missing leaves
for breads, salads, custards, sauces and other preparations; order-sensitive steps distinguish their
methods. Flavor intensities are editorial estimates on the existing 0–5 scale, not measurements.
Plain eggs, sashimi, gnocchi, hardtack, meringue and rosewater lokum use one honest aroma note where a
second would require invention. A profile describes a representative preparation; dish variations
can differ. Crema catalana follows its displayed baked recipe.

Imported pages with profiles now show both “Made the same way” and “Tastes alike”, with scores and
explanatory tags, through the same component used on curated pages. Other imported dishes do not
receive inferred matches. Both directions use the same curated/imported candidate pool and exclude
the dish itself. The matching weights are unchanged.

## Readback

`match-readback.jsonl` records manually inspected nearest matches for 20 representative dishes.
Examples: acarajé matches falafel by preparation; hummus matches falafel by taste, below three dips by
preparation; crème brûlée matches crema catalana; lychee pork matches crisp sweet-and-sour pork;
meringue matches pavlova; layered laobing matches msemmen and scallion pancake. Bánh chưng now precedes
tamale as a zongzi method match, appropriately sharing sticky rice and leaf-wrapped cooking; the
regression test retains both in the top two. Low scores elsewhere still reflect sparse nearby
coverage, especially unique preparations such as gnocchi.

Remaining: the rest of the imported catalog is unprofiled, and deferred identity/variant collisions
need source repair before honest universal matching. See the reading notes and parent decisions.
