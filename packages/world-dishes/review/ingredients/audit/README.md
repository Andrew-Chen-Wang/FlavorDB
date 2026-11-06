# Ingredient mapping audit

Readers reread 6,812 distinct strings in 6,931 decisions against the ingredient vocabulary and, where
needed, the source recipe. This includes five spread positions from **every one of 144 archived
batches**, plus **all 3,188 strings** mapped to any of 2,179 rarely used ingredients (at most three
language/text mappings per ingredient). These are counts of mapping strings, not dish frequency.

The initial 3,884-row sample exposed positional alignment errors. Readers then reread all 600 rows in
each of `en-003`, `fr-001`, `pl-004` and `ja-000`, plus 647 previously unaudited strings associated with
implicated ingredient IDs. Clear drift occurred at en-003 lines 256–343, fr-001 445–458, pl-004 194–225,
and intermittently in the Japanese tail, especially 564–577. Each correction was read individually;
no inferred offset or keyword rule moved mappings.

The result changes 766 shared mappings, adds six dish-specific overrides, adds 23 ingredients for
prepared foods or distinct products, and corrects 17 vocabulary names/categories. No ingredient entry
was removed. Corrections include fresh versus ground coriander, parsley root versus parsnip, caraway
versus cumin, fresh cheeses versus quark, and many unrelated substitutions caused by shifted rows.

`inputs.jsonl` preserves the inputs and original meanings. `verdicts/` preserves every reader decision,
including unchanged mappings and notes. `resolutions.jsonl` records the parent reader's resolution of
conflicting opinions. `corrections.jsonl` is the explicit merged change list. Scripts only select,
validate, merge and apply these decisions. The audit is a sample of common ingredients, not a full
reread of all 80,990 mapping strings; unexamined common-ingredient errors may remain.

`context-corrections.jsonl` handles identical wording whose meaning differs by recipe. Fresh coriander
in salsa, tandoori chicken and pani puri must not change an unrelated recipe's seed spice. Source URLs
and reasons accompany every override. See `UNUSUAL.md` and `notes.jsonl` for items retained for the
user's decision.

## Reproduce

From the repository root:

```sh
mkdir -p packages/world-dishes/.cache/ingredient-readings
tar xzf packages/world-dishes/review/ingredients/readings.tgz -C packages/world-dishes/.cache/ingredient-readings
python3 packages/world-dishes/review/ingredients/consolidate.py
pnpm run format
```

The merge retains the historical synonym decisions to reproduce the original merge, then applies
literal audited corrections with assertions against their original mappings. `vocabulary.json` is the
original 173-item curated vocabulary snapshot, not the expanded current vocabulary; using the latter
would silently change old exact matches. `exact-matches.json` preserves 23 original unbatched entries
not reconstructible from the archive and that snapshot. Application requires no network or model.
