---
name: profile-dish-similarity
description: Add or change a dish's similarity profile (form, main ingredient, steps, flavor notes, taste intensities) so it shows up correctly under "Made the same way" and "Tastes alike", including linking dishes from the world collection. Use when similar dishes look wrong, or when adding curated or world dishes that should be matched.
---

## How similar dishes work

All of it is in `packages/seed-data/src/`:

- `graph.ts`: a category graph where each category lists its parents (a category can have several).
  Similarity is a weighted Jaccard over two dishes' ancestor sets, with rarer categories counting for
  more. `sameFamily` compares the top-level family (noodles, meat, seafood…) via the first parent.
- `categories.ts`:
  - `FORM_GRAPH`: what a dish looks like and the broad way it's made. Leaves are what dishes are
    tagged with; groups like `noodle-dish` and `wok-fried` sit above them.
  - `BASE_GRAPH`: the main ingredient. Noodles are split by material and shape.
- `profiles.ts`: one `Profile` per curated dish (`form`, `base`, `steps`, `notes`). The taste
  intensities are the dish's `flavor` in `dishes/*.ts`.
- `world-links.ts`: hand-profiled dishes from the world collection (`@flavor-db/world-dishes`), keyed by
  their world id (a Wikidata QID). They join the pool and link to `/world/<id>`.
- `similarity.ts`: the two scores.
  - **Made the same way:** look and process only, never taste. 50% form graph, 35% steps (rarer steps
    weigh more, and order counts), 15% base graph.
  - **Tastes alike:** 20% same base family plus 15% base graph, 35% basic tastes (sweet, salty, sour,
    bitter, umami, heat, numbing), 20% flavor notes and 10% form graph.

What the user asked for, and what to preserve:
- "Made the same way" means it looks similar and goes through a similar process (stir-fried noodles
  match stir-fried noodles from any culture), whatever it tastes like.
- "Tastes alike" starts from the main ingredient (a noodle dish tastes most like other noodle dishes),
  then the taste profile. It should include same-country dishes as well as other cultures'.

## Profiling a dish

1. **form**: the leaf of `FORM_GRAPH` that matches how it's served. If none fits, add a leaf with the
   right parents rather than forcing it. A stir-fried dish of pieces is `stir-fried-pieces`, not
   `pieces-in-sauce`.
2. **base**: what the dish *is*. For noodle dishes, list only the noodle (the most specific kind:
   `round-rice-noodles`, `flat-rice-noodles`, `alkaline-noodles`…), not the toppings. For other dishes,
   list one or two main ingredients.
3. **steps**: the defining steps, in order (e.g. `soak → stir-fry`, `make-dough → fill → wrap → steam`).
   Only use steps that change how it looks or eats.
4. **notes**: 2–6 flavors beyond the basic tastes (soy, chili, wok-hei, fermented-bean…).
5. **flavor** (`flavor(sweet, salty, sour, bitter, umami, spicy, numbing, smoky, rich)`, 0–5): how
   strongly each taste registers. Be honest about heat; mild dishes shouldn't match fiery ones.

For a world link:
- check the id exists in `packages/world-dishes/data/dishes-*.jsonl`;
- give it `name`, `localName` (in its own script) and `countries`;
- don't add one that duplicates a curated dish.

## Checking

- Print the top matches for the dishes you touched and their neighbours, and read them as a person
  would. For example: does chao fen's "made the same way" list only stir-fried noodles?
- Add a test in `packages/seed-data/src/index.test.ts` for the behaviour you're protecting, then run
  `pnpm test`, `pnpm run lint` and `pnpm --filter=website run build`.
- Look at a dish page's "Similar dishes" section in a browser: the tags should explain each match.
