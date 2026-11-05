---
name: review-world-dishes
description: Review imported world dishes one by one by reading them (keep/remove, fix names and countries, check each recipe against its raw source), using parallel subagents, then validate, second-check and apply the verdicts. Use when asked to review, clean up or check the dishes in packages/world-dishes.
---

## What this is

`packages/world-dishes` imports ~31,800 dishes and ~15,400 recipes from Wikidata, Wikibooks cookbooks
(12 languages) and HowToCook. The parsers are imperfect, so every dish is **read by a model, one by
one**. The user explicitly does not want a parser, regexes or keyword rules deciding what stays: a
reader looks at each dish and its raw source page and judges it.

Everything lives in `packages/world-dishes/review/`:

- `INSTRUCTIONS.md`: the rules a reviewer follows (keep/remove, fixes, recipe checks, output format).
  Read it before anything else; this skill doesn't repeat it.
- `REVIEWER_PROMPT.md`: the prompt for one reviewer.
- `batches/NAME.md` (git-ignored): one batch of ~25–40 dishes (`r-NNN`, with recipes and their raw
  source, cut at 6,000 characters) or 300 name-only dishes (`names-NNN`). Unpack the pending ones from
  `pending-batches.tgz`; `build-batches.mts` rebuilds all of them from the fetch cache.
- `verdicts/NAME.jsonl`: one JSON line per dish, in batch order. Commit these.
- `README.md`: current status and known issues. Keep it up to date.

## 1. Review the batches

1. Unpack: `mkdir -p packages/world-dishes/review/batches && tar xzf packages/world-dishes/review/pending-batches.tgz -C packages/world-dishes/review/batches`.
2. Work out what's left: a batch is done when `verdicts/NAME.jsonl` has as many lines as the batch has
   `## DISH` headings. Partly done batches only need their missing dishes appended, in order.
3. Give each reviewer **2–3 batches** (~100 dishes) with `REVIEWER_PROMPT.md` and the batch names.
   Use a small, cheap model (Haiku-class); run many in parallel. Keep about 20 running at once and start
   a new one each time one finishes. Bookkeeping (which groups are launched) can be a script; judging
   can't.
4. Reviewers may only read the batch and write the verdict file. No shell, scripts, network or
   sub-agents. Earlier reviewers created stray sessions or ran shell commands when this wasn't spelled out.
5. Reviewers must read the whole batch file. Long files have to be read in parts, and lines are wrapped
   so they aren't truncated.
6. Expect usage limits to stop reviewers mid-batch. A stopped reviewer leaves no file or a partial one.
   Check the line counts and rerun what's missing, rather than trusting the reviewer's summary.
7. Commit verdicts in chunks as you go so nothing is lost if the session ends.

## 2. Validate

A script may check the _format_ (it must not judge content):

- every line parses as JSON and has `id` and `verdict`;
- the line count and order match the batch's `## DISH` headings. Match verdicts to dishes **by
  position**. Reviewers sometimes mangle ids: HowToCook ids gain or lose a repeated `:name` suffix, and
  Hungarian ids gain a `-1`. Accept those and report anything else;
- `fixed` recipes have non-empty `ingredients` and `steps`, and `countries` are ISO alpha-2 codes.

## 3. Second opinion

Small models make confident mistakes. Have a stronger model (Sonnet-class) reread, against the batch
entry, **every `remove` verdict and every `countries` or `name` change**. It should reverse the wrong
ones and write the corrected line back. Known mistakes so far:

- real dishes removed: Tırşik çorbası, Errötendes Mädchen;
- countries guessed from the cookbook's language instead of the dish: falafel set to IN;
- plain ingredients handled inconsistently. Rule: keep prepared foods and named traditional products
  (cheeses, sausages, cured meats); remove a plain raw ingredient only when the page is about the
  ingredient and has no recipe.

Every kept dish must have at least one country (the order for choosing one is in `INSTRUCTIONS.md`),
and the build enforces it. FlavorDB takes no side on where a dish comes from: a disputed dish lists every country it's commonly
tied to.

## 4. Apply

- Apply verdicts in the build, next to `src/normalize/quality.ts`, so a rebuild keeps them:
  - drop `remove` dishes;
  - apply `name` and `countries`;
  - replace a `fixed` recipe's ingredients and steps (match recipes by `source` URL);
  - drop `drop` recipes, and drop a non-Wikidata dish left with no recipes.
- Rebuild with `pnpm --filter=@flavor-db/world-dishes run build-data` (needs `.cache/` from `run fetch`).
  Without the cache, apply the same code to `data/dishes-*.jsonl` directly, and say so.
- Record the counts in `data/REVIEW.md` and `data/STATS.md`.
- Run `pnpm test`, `pnpm run lint`, `pnpm run format` and `pnpm --filter=website run build`, then
  update the PR with the totals, the main kinds of removals, and the follow-ups:
  - pages holding several recipes where only one was imported;
  - raw sources cut at 6,000 characters, so long pages were only partly checked.
