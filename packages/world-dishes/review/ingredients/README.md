# Ingredient mapping

What each imported ingredient name and recipe line names on FlavorDB's shared ingredient list, so the
pantry and ingredient pages cover the imported dishes. The result is `data/ingredient-map.json`, which
the loader turns into each dish's `ingredientIds`.

- 82,000 distinct strings (7,851 Wikidata ingredient labels, 74,391 recipe lines in 12 languages) were
  read in 144 batches of up to 600, one language per batch, following `MAP_PROMPT.md`. Readers used an
  existing ingredient where one fit and proposed a new one otherwise. `readings.tgz` holds every batch
  and every reading.
- Strings that already matched an ingredient name or alias exactly were accepted without reading.
- `consolidate.py` merged the proposals: plurals, spellings and synonyms folded together (stock, broth
  and bouillon; yoghurt and yogurt; the leek spellings), and the shared list grew by 3,162 ingredients
  (`packages/seed-data/src/ingredients-world.ts`). It also applies the fixes from a reread of lines
  where one reader went against the others: olive oil filed as vegetable oil (Italian and Japanese),
  pasta shapes filed as spaghetti, and generic cheese filed as cheddar or mozzarella.
- Coverage: 99% of the imported dishes that list ingredients or have a recipe get ids; 17,000 have two
  or more and can be matched in the pantry.

Not ingredients: headings ("For the sauce:"), equipment, instructions and serving notes map to nothing.

## Follow-up audit

The [audit](audit/README.md) reread 6,812 distinct strings, including samples from all 144 batches and
every string mapped to a rarely used ingredient. It corrected 766 shared mappings and six
recipe-specific meanings. It also made the archived merge reproducible from the repository. See the
[unusual ingredient list](audit/UNUSUAL.md) for user decisions; those entries remain in the catalog.
