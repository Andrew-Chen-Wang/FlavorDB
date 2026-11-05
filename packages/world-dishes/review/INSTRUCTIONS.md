# FlavorDB dish review: instructions

FlavorDB is a website about the world's dishes: where each dish comes from, how it varies, and how to
cook it. We imported dishes from Wikidata, Wikibooks cookbooks (12 languages) and HowToCook. Your job
is to **read every dish in your batch yourself, one by one**, and decide whether it belongs and whether
its data is right. Do not write or run code, scripts or regexes. Use the Read tool to read your batch
file (it can be long: read it in parts with `offset`/`limit` until you reach the end) and the Write tool
to write your results.

## For each dish (each `## DISH <id>` section)

1. **Keep or remove?** Keep anything a person cooks, bakes, prepares or eats as a dish or prepared
   food: traditional and obscure regional dishes, breads, cakes, sweets, cheeses, sausages, sauces,
   pickles, soups, snacks, home recipes. Remove:
   - branded or packaged products, chain-restaurant menu items (e.g. "McPlant", "Oreo", "Nissin cup noodles")
   - drinks (alcoholic or not: beer, wine, cocktails, juices, teas, coffee drinks, smoothies)
   - categories or groupings rather than one dish ("seafood dish", "Italian desserts")
   - things that aren't food: objects, museum pieces, people, places, fictional or video-game food
   - pages that aren't a recipe for a dish: technique pages, ingredient explanations, indexes, menus
     or lists of other recipes
   - nonsense or empty entries you can't identify as any real dish
   When unsure whether an obscure name is a real dish, **keep** it. Many entries are only a name with
   no description: that's not a reason to remove them. A plausible dish name ("Kartofle nadziewane",
   stuffed potatoes) stays. Only call something "not a recipe page" when you can see its recipe
   source and it really isn't one.
2. **Fix obvious data errors**, only when you're confident:
   - `name`: if the name is garbled, has wiki markup, a trailing number, a namespace prefix, or is a
     sentence rather than a name. Keep the dish's own language and spelling; don't translate.
   - `countries`: ISO 3166-1 alpha-2 codes. Only change them when the current list is clearly wrong
     or empty and you know where the dish is from. FlavorDB doesn't take sides in origin disputes: list
     every country the dish is commonly said to belong to. Judge the dish itself, never the language
     of the cookbook it came from: a Thai curry in the Italian cookbook is TH, and a generic dish that
     isn't tied to any place (e.g. "fruit salad", "pancakes with jam") gets no country.
3. **Each recipe** (`### Recipe N`): compare the *Extracted ingredients* and *Extracted steps* with the
   *Raw source page* underneath.
   - `ok`: the extraction faithfully has the ingredients and the method (small formatting
     differences are fine).
   - `fixed`: something is wrong (ingredients missing or mixed into steps, steps missing or that are
     really headings or ingredients, leftover markup, two recipes mashed together, wrong section).
     Then write the correct `ingredients` (one string per line, with amounts) and `steps` (one string
     per step) **copied from the raw source, in its original language**. Never invent or translate.
   - `drop`: the raw source isn't a recipe for this dish, or has no usable method.

## Output

Write **one JSON object per line** (JSON Lines) to the output file named in your task, one line for
**every** dish in the batch, in the same order. Keep lines compact. Fields:

```json
{"id":"Q123","verdict":"keep"}
{"id":"Q456","verdict":"remove","reason":"brand product (packaged candy bar)"}
{"id":"wikibooks-de:streuselkuchen","verdict":"keep","recipes":[{"source":"https://de.wikibooks.org/…","status":"fixed","reason":"steps were sub-headings","ingredients":["250 g Mehl","…"],"steps":["Die Eier …","…"]}]}
{"id":"Q789","verdict":"keep","name":"Feijoada","countries":["BR","PT"],"reason":"name had markup; added countries"}
```

- `id` and `verdict` are required on every line. Add `reason` whenever you remove or change something.
- Only include `name` / `countries` when you change them.
- Only include `recipes` when the dish has recipes; give one entry per recipe, in order, with `source`
  and `status`, plus `ingredients` and `steps` only when `status` is `fixed`.
- The output must be valid JSON Lines: double quotes, escaped quotes inside strings, no trailing commas.

When you've written the file, reply with one line: how many dishes you kept, removed, and how many
recipes you fixed or dropped.
