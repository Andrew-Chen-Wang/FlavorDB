# Per-dish review (in progress)

Every imported dish is being read one by one by a model reviewer (no parsers), following
[`INSTRUCTIONS.md`](INSTRUCTIONS.md). Each batch is a Markdown file with ~25–40 dishes; for recipes it
includes the raw wiki/markdown source page (truncated at 6,000 characters) so the extraction can be checked.

## Layout

- `INSTRUCTIONS.md`: rules for keep/remove, name and country fixes, recipe checks, and the output format.
- `REVIEWER_PROMPT.md`: the prompt given to each reviewer, with paths relative to the repo root.
- `verdicts/NAME.jsonl`: finished verdicts, one JSON line per dish, in the batch's order. 300 files so far;
  all parse as JSON.
- `pending-batches.tgz`: the 378 batch inputs that still need reviewing (or finishing). Extract with
  `mkdir -p packages/world-dishes/review/batches && tar xzf packages/world-dishes/review/pending-batches.tgz -C packages/world-dishes/review/batches`.
  `batches/` is git-ignored.
- `pending-batches.txt`: the list of those batches.
- `build-batches.mts`: how the batches were built. It needs the fetch cache
  (`packages/world-dishes/.cache`, from `pnpm --filter=@flavor-db/world-dishes run fetch`), so you
  normally don't need to run it.

Batches are `names-NNN` (dishes with no recipe, 300 per batch) and `r-NNN` (dishes with recipes).

## Status

- Done: 297 batches (`names-000`–`names-058`, `r-000`–`r-200` with gaps, and a few later ones).
- Partly done, only the listed dishes are missing (append their lines in input order):
  `names-025` (Q141385059), `names-036` (Q275621, Q2845744), `r-055` (Q573516).
- Not started: the rest of `pending-batches.txt`, mostly `r-201` onwards. Some of `r-201`–`r-254` may
  have been started; their verdict files aren't in `verdicts/`, so redo them in full.

## Known issues in the verdicts

- Some verdict `id`s differ from the batch's `## DISH` id for HowToCook dishes (a repeated `:name` suffix
  added or dropped, e.g. `howtocook:soup:米粥` vs `howtocook:soup:米粥:米粥`) and in `r-225`
  (`wikibooks-hu:libatepertő` written as `…-1`). When applying, match a verdict to its dish by position in
  the batch, and check the id matches after normalising.
- Reviewer mistakes seen in spot checks: real dishes removed (Tırşik çorbası, Errötendes Mädchen) and wrong
  countries (falafel set to IN). Every `remove` and every `countries` change needs a second check before
  it's applied.
- Reviewers handled raw ingredients (honey, olive oil, protected cheeses) inconsistently. Rule to apply:
  keep prepared foods and named traditional products (cheeses, sausages, cured meats); remove plain raw
  ingredients only when the page is about the ingredient and has no recipe.
- Raw sources are cut at 6,000 characters, so recipe checks on long pages only cover the start.
- Pages with several recipes (brigadeiro, Castagnaccio, Bacalhau à Brás and others) keep only the recipe
  the importer extracted; the rest are a follow-up.
