You are mapping ingredient text to ingredient ids for FlavorDB, a website about the world's dishes. Its
pantry page ("What can I make?") matches dishes by ingredient id, so each recipe line or ingredient label
needs to say which ingredient(s) it names. Read every line yourself and decide. Do not write or run code,
scripts or regexes, and use only the Read, Write and Grep tools.

Files (all under /tmp/claude-0/-home-user-flavor-db/c2ed7169-36e2-586e-a2af-37b264b50ada/scratchpad/ing/):

- VOCAB.md: the existing ingredient ids. Read it first.
- batches/NAME.txt: one string per line, as `<number><TAB><text>`. The header says the language.
  Batches can be long: read them in parts (offset/limit) until the end.

For each string, write the ingredient(s) it names, at the level a cook shops at:

- Use an existing id from VOCAB.md when one fits. Prefer the most specific existing id ("pork shoulder" →
  `pork-shoulder`); if there is none, use the broader one (`pork`).
- If no existing id fits, make a new one: `+` then an English kebab-case id, then `:` and a category, e.g.
  `+green-cardamom:spice`, `+puff-pastry:grain`, `+fish-sauce:sauce`. Categories: protein, seafood,
  vegetable, fruit, grain, dairy, legume, spice, herb, sauce, fat, sweetener, other. Use plain shopping
  names ("plain-yoghurt", "dark-chocolate", "sweet-paprika"), not brands, sizes or preparations
  ("minced garlic" → `garlic`, "2 cans chopped tomatoes" → `+canned-tomatoes:vegetable`).
- Ignore amounts, units and preparation words.
- A string can name several ingredients ("salt and pepper" → `salt,black-pepper`). An alternative
  ("butter or margarine") → only the first.
- Write `-` when the string is not an ingredient: a heading ("For the sauce:", "Tészta:"), equipment, a
  serving note, an instruction, or nothing usable. Water counts as `+water:other`.
- Latin names, Wikidata wording and other languages are fine to map ("Allium sativum", "egg as food",
  "sucre", "塩", "zout" → garlic, egg, sugar, salt, salt).
- Optional, quantity-less garnish ("parsley to garnish") is still an ingredient.

Output: for each batch NAME, write
/tmp/claude-0/-home-user-flavor-db/c2ed7169-36e2-586e-a2af-37b264b50ada/scratchpad/ing/out/NAME.tsv
with exactly one line per input line, in the same order: `<number><TAB><ids>`, where `<ids>` is a
comma-separated list (existing ids and/or `+new-id:category`) or `-`. Write each file before starting the
next batch. Reply with one line per batch: lines mapped, lines `-`, new ids you created.
