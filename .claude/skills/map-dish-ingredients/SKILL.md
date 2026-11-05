---
name: map-dish-ingredients
description: Map the imported world dishes' ingredients (Wikidata labels and recipe lines in 12 languages) onto FlavorDB's shared ingredient list, by reading, so every dish works in the pantry ("What can I make?") and on ingredient pages. Use when asked to connect imported dishes to ingredients, the pantry or the ingredient graph.
---

## Why

The site has one dish catalog: the hand-written dishes in `packages/seed-data` and ~30,000 imported dishes
in `packages/world-dishes`. Pantry matching (`apps/website/src/app/pantry/`) and the ingredient pages
work on **ingredient ids** from `packages/seed-data/src/ingredients.ts` (~170 so far). Imported dishes
only have loose text, so today they can't appear in either:

- `dish.ingredients`: Wikidata labels, mostly English, sometimes Latin or other languages
  ("Cucumis sativus", "egg as food", "塩", "sucre"). About 8,100 distinct labels.
- `recipe.ingredients[].item`: raw recipe lines in the recipe's language ("250 g Mehl", "2 gousses
  d'ail", "葱 适量"). About 74,500 distinct lines.

The user wants the pantry and ingredient pages to cover every dish, not only the hand-written ones.

## The mapping is read, not parsed

As with the dish review (see the `review-world-dishes` skill), the user doesn't want keyword rules or
fuzzy matching deciding what an ingredient is. Readers decide. Scripts may:

- collect distinct strings and batch them;
- auto-accept an exact, case-insensitive match against an ingredient's `name` or `aliases`;
- validate and apply the results.

Everything else is read by a model, in batches of a few hundred strings.

1. **Vocabulary first.** Grow `ingredients.ts` to cover what the strings actually use: common staples,
   produce, meats, dairy, spices, sauces. Aim for the level a cook shops at: "flour", "plain yoghurt",
   "soy sauce". Skip brands and sizes.
   - Give each new ingredient an id, a category and aliases in the languages it appears in (that also
     makes later exact matches work).
   - Keep the existing ids; pages link to them.
2. **Map distinct strings.** For each string, a reader writes the ingredient id(s) it names, or
   `null` when it isn't an ingredient. Write the results to
   `packages/world-dishes/review/ingredients/NAME.jsonl`, one `{"text": "...", "ids": [...]}` per line.
   - Not ingredients: headings, "for the sauce:", equipment, garnish-only notes.
   - A line can name two ingredients ("salt and pepper").
   - Prefer the most specific id that exists, and fall back to the broader one ("pork shoulder" →
     `pork-shoulder` if it exists, else `pork`).
3. **Second check.** A stronger model rereads a sample of every batch and every string mapped to a newly
   added ingredient. Fix systematic mistakes across all batches.
4. **Apply.** Give each imported dish `ingredientIds` (the union over its labels and every recipe's
   lines), in the world-dishes loader or build, so a rebuild keeps them. Record coverage in `STATS.md`:
   - dishes with any ids;
   - share of recipe lines mapped;
   - the most common unmapped strings.

## Then the pantry and ingredient pages

- **Pantry:** match every dish with ingredient ids, hand-written and imported, and rank dishes with a full
  recipe first. 20,000+ dishes are too many to ship to the browser, so score on the server (an API route
  or server action), returning only the buckets shown. Keep the 0 / 1 / 2 / 3-missing buckets and the
  staples toggle.
- **Ingredient pages and the ingredient graph:** count and list imported dishes too.
- Imported dishes link to `/dishes/<id>`, the same as hand-written ones.

## Checks

- Tests: exact matches map, unmapped strings are reported, a pantry query returns imported dishes with
  recipes.
- Run `pnpm test`, `pnpm run lint` and `pnpm --filter=website run build`.
- Try the pantry in a browser. For example, eggs, flour, milk and sugar should find crêpes and pancakes
  from several countries.
