# Commons photo review

## First pass: 6 November 2026

From main `c49866d`, 17,632 of 29,984 imported dishes had no photo. This pass reviewed **502
candidates**, accepted **157 photos** and rejected **345**. Supplemental photos rose from 1,868 to
2,025; **17,475 dishes still have no photo**. This is an initial pass, not complete photo coverage.

Discovery covered every supplied Wikipedia link among the missing dishes (764 dishes), exact-name
candidate comparisons against existing catalog photos, P18/P373 for the first 40 missing Wikidata
ids, and Commons searches for all supplied names of the first 120 missing dishes in sorted shard
order. The Wikipedia, existing-source, Wikidata and name-search passes contributed 118, 144, 21 and
219 candidates respectively. See `discovery.json` for the precise ids/queries and baseline.

**Still to do:** Commons name searches for the remaining dishes, P18/P373 checks for the remaining
Wikidata ids, and further category/search alternatives where the first results were unsuitable. A
missing image must not be interpreted as proof that no suitable Commons image exists. Original
photos present before this pass were not re-reviewed.

Photo candidates are suggestions, not approved matches. A model reads each dish's name and description
(and its recipe when necessary), looks at the thumbnail, and records an individual decision and reason
in `verdicts.jsonl`. Only explicit `keep` decisions reach `data/images.json`. Finished food must be
identifiable; recipe scans, portraits, buildings, raw ingredients, preparation shots and uncertain
same-name dishes are rejected. An exact name is only a way to find a candidate.

`candidates.json` preserves the discovery URL and Commons description, creator and license metadata.
Each verdict identifies both its numeric candidate position and its dish id/file name, so validation
can catch omissions, duplicate reviews and shifted positions. The loader preserves author/license
credits, which the dish page shows beside its Commons file link. Where Commons' machine-readable
author is missing, a reader checked the file page and recorded `author` and `authorSource` in the
verdict instead. No attribution is inferred from a file name.

## Reproduce an approved application

From the repository root, with Python 3.11 or later:

```sh
python3 packages/world-dishes/review/photos/collect.py apply
```

This needs no network or fetch cache. It validates complete candidate coverage and one accepted
photo per dish before saving anything; an existing different photo is never overwritten. Repeating
the application produces the same `images.json`.

## Collect the next candidates

```sh
python3 packages/world-dishes/review/photos/collect.py collect --source wikipedia
python3 packages/world-dishes/review/photos/collect.py collect --source known
python3 packages/world-dishes/review/photos/collect.py collect --source wikidata --offset 0 --limit 40
python3 packages/world-dishes/review/photos/collect.py collect --source search --offset 0 --limit 120
python3 packages/world-dishes/review/photos/collect.py metadata
```

`known` finds exact name matches with existing photos elsewhere in the catalog, retaining the original
Wikidata/Wikipedia discovery URL. `wikidata` reads P18 and P373 and collects up to five files per
category. `search` searches the dish's name and every supplied language name on Commons. Wikipedia
leads are requested with `pilicense=free`, then resolved separately on Commons; files that exist only
on Wikipedia do not pass that check.

Responses are cached under `.cache/photos`. A shared process lock serializes uncached requests, with
a pause before each request. HTTP 429/5xx and MediaWiki rate-limit/maxlag responses cause exponential
backoff; HTTP 429 also honors `Retry-After`. A failed request stops the run instead of silently
recording an empty result. An interrupted collection resumes from its cached responses and saved
candidates. Offsets refer to the current missing-photo list, so finish a discovery window before
applying its photos and record which ids were searched.

With Pillow installed, generate contact sheets of 30 candidates:

```sh
python3 packages/world-dishes/review/photos/collect.py sheets --offset 0 --limit 30
```

Read the metadata and view every tile; use a larger view or the original dish record when uncertain.
Write a verdict for every candidate, retaining the supplied id and file name. After all saved
candidates have a verdict, snapshot their evidence, then apply:

```sh
python3 packages/world-dishes/review/photos/collect.py snapshot
python3 packages/world-dishes/review/photos/collect.py apply
```

The snapshot excludes downloaded image bytes. Nothing chooses a photo based on keywords, extensions,
search rank, category membership or name equality.
