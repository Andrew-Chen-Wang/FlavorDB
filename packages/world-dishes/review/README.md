# Per-dish review completed

All 31,832 baseline dishes have one verdict across 675 files (`names-000`–`names-058` and
`r-000`–`r-615`). All 378 inputs in the historical pending list have been read and completed.
Dishes and recipes were judged by readers, not by scripts or keyword rules. Scripts perform
bookkeeping, transcription, structural validation, positional matching, and application only.

Every removal, country override, and name override received a second check. Exact audit coverage
and corrections are recorded in `audits/`, `old-recipes-120-159.md`, and `audit-old.md`.
Tırşik çorbası and Errötendes Mädchen were restored. Prepared foods and traditional products
remain; plain ingredients without recipes, drinks, brands, technique pages and nonfood pages
were removed. Countries describe the dish and include shared associations, independently of
cookbook language. The name audit covers all 315 current name overrides.

## Applied results

Applied directly to checked-in shards using the same code used by `build-data`, because the fetch
cache is absent. The resulting dataset contains **30,174 dishes and 14,355 recipes**.

| Change                                                   | Count |
| -------------------------------------------------------- | ----: |
| Dishes removed                                           | 1,658 |
| …after dropping their last recipe, without a Wikidata ID |    48 |
| Dishes renamed                                           |   314 |
| Countries changed                                        | 8,903 |
| Recipes fixed                                            | 1,859 |
| Recipes dropped                                          |    77 |

Application counts measure changes to the data, not merely the presence of an override. Recipes
belonging to removed dishes are excluded from recipe-fix/drop counts. `data/review-application.json`
records the verdict and output hashes and counts; rerunning the command with identical inputs is
a no-op. Revised verdicts require restoring baseline shards or rebuilding from the fetch cache.

## Validation and evidence

- `pnpm --filter=@flavor-db/world-dishes run review:check`: JSON, required metadata reasons,
  recipe shapes, alpha-2 code format, exact positional IDs and line counts for all 675 files.
- `pnpm --filter=@flavor-db/world-dishes run review:coverage`: independently checks all baseline
  IDs and global order against Git commit `9333faf`, including missing and duplicate dishes.
- `pnpm --filter=@flavor-db/world-dishes run review:audit-coverage`: verifies all 8,160
  original-input target IDs appear in the fresh audit ledgers.
- `review/batch-ids.json`: persisted actual dish IDs by batch position. The build uses these
  positions and accepts only the documented repeated HowToCook suffix and r-225 `-1` mistakes.
- Every kept dish's imported recipe has exactly one status with its exact source URL; all country
  override codes were additionally checked against ISO 3166-1 alpha-2.
- `pending-batches.txt` and `pending-batches.tgz` are historical input artifacts, not remaining work.
  Unpack both archives into ignored `batches/` to inspect all 675 original inputs.

The 297 earlier batches supplied in `original-batches.tgz` have now been extracted alongside the
378 batches in `pending-batches.tgz`. Every removal, country override and name override in those
297 batches received a fresh second opinion against its actual original entry, including the
supplied raw excerpts. The `audits/original-*.md` ledgers record each targeted dish and outcome;
`check-original-audits.mts` checks target-ID coverage against the pre-follow-up verdict snapshot
`8476ba3`. The pass covered 8,160 targeted or subsequently changed records, corrected 540
verdict lines, restored 60 mistaken removals and newly removed 35 items. All 675 original batch
counts and boundaries now match the positional manifest.

Leaf Masala retains ZA because the source identifies Cape Malay cuisine. The modern HowToCook
Italian-sausage shakshuka adaptation has an empty country list: Italian
sausage does not establish Italian provenance, and its generic North African title does not
justify assigning this particular adaptation to every country associated with traditional
shakshuka. Falafel retains inclusive Egyptian and Levantine associations; it is not assigned IN.

A structural recipe audit found 29 missing recipe statuses and one mistyped source URL. The gaps
were closed by reading the available original Tarator/Raffaello input and 27 recovered live raw
pages. These live pages are explicitly distinguished from original snapshots in the verdict reasons
and supplemental audit. `recovered-recipe-sources.tgz` preserves the live supplemental inputs.
Missing rationale fields on already authored metadata decisions were filled with manual-audit
provenance; this did not change any verdict, name, country, or recipe decision.

## Follow-ups

- Pages containing several recipes still generally include only the recipe imported originally:
  brigadeiro, Castagnaccio, Bacalhau à Brás, Sárgatúró, dashi and others. Importing the additional
  recipes is separate work.
- Original raw excerpts were cut at 6,000 characters. Long pages were only partly checked;
  corresponding extraction beyond the supplied excerpt remains unverified where explicitly noted.

## Final checks

- `pnpm test`: 119 tests passed across eight files.
- `pnpm run lint`: passed (warnings remain).
- `pnpm run format`: passed.
- `pnpm --filter=website run build`: passed after merging main and applying the data.
- All three review checkers pass. A second `review:apply` run confirms an exact no-op with unchanged counts.
