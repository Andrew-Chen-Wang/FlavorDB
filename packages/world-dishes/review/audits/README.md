# Second-opinion coverage

The mandatory-country follow-up uses `countries-first-01.jsonl` through
`countries-first-25.jsonl` and matching `countries-second-*.jsonl` ledgers. The frozen
`../country-targets.json` identifies 10,394 previously countryless entries by original batch
position, plus two explicit special cases. Readers inspect each complete supplied entry and raw
excerpt; the second reader independently checks the resulting decision. First ledgers preserve
the initial decisions even when a second reader corrects them. `../check-countries.mts` checks
exact coverage, order and agreement with final verdicts without making editorial decisions.
Two continent-only African recipes retain explicitly provisional countries with user approval;
their reasons and the review README record that provenance limitation.

The original-input recheck supersedes the earlier metadata-only second opinions for all 297
batches supplied in `original-batches.tgz`. Each `original-*.md` ledger records targeted dish IDs,
positions, retained decisions and corrections after reading the actual entries and raw excerpts.
The fresh pass covered 8,160 targeted or changed records across the 297 recovered batches;
540 verdict lines changed, with 60 removals reversed and 35 new removals. All 675 original batch
inputs are now available and independently match the positional manifest.

`../check-original-audits.mts` mechanically checks that every original-scope removal, name or
country target from commit `8476ba3`, plus changes through `a1898bb`, appears in the new ledgers. It does
not judge dishes or substitute for the readers' completion reports.

The table below preserves the earlier audit history; the new `original-*.md` ledgers are the
current evidence for those previously reconstructed inputs.

| Scope                                         | Evidence                                                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| names-000–009                                 | ../audit-old.md (1,783 targeted entries)                                                                  |
| names-010–019                                 | old-names-010-019.md (1,032)                                                                              |
| names-020–039                                 | Reviewer completion: 1,904 entries; 164 corrected lines, committed in chunks                              |
| names-040–058                                 | Reviewer completion: 1,390 entries; 123 corrected lines, commits 99f4cec and 3bd5a06                      |
| r-000–019                                     | old-recipes-000-019.md                                                                                    |
| r-020–079                                     | old-recipes-020-079.md                                                                                    |
| r-080–119                                     | old-recipes-080-159.md (retained scope explicitly 080–119)                                                |
| r-120–159                                     | ../old-recipes-120-159.md                                                                                 |
| Older absent r-160–254                        | old-recipes-160-254.md                                                                                    |
| Available early batches; r-255–305, r-440–529 | second-early-and-270-529.md                                                                               |
| r-300                                         | Explicit older metadata audit, commit 6178d7d                                                             |
| r-306–312                                     | second-306-319.md (313–319 explicitly reassigned)                                                         |
| r-313–319                                     | second-313-319.md                                                                                         |
| r-320–354, 395–401, 410–418                   | second-320-439.md                                                                                         |
| r-355–379                                     | second-355-379.md                                                                                         |
| r-380–394                                     | second-380-394.md                                                                                         |
| r-402–409, 419–429                            | second-402-439.md                                                                                         |
| r-430–431                                     | second-430-439.md (432–439 explicitly reassigned)                                                         |
| r-432–435                                     | second-432-435.md                                                                                         |
| r-436–439                                     | second-436-439.md                                                                                         |
| r-530–615                                     | Reviewer completed all target entries; corrections 709588e and 51d2820, plus Thanksgiving menu in f81b229 |
| All name overrides                            | names-second-opinion.md: 304 current exact values, 306 historical targets                                 |

Supplemental recipe gaps are documented in supplemental-r-246.md and in the live-recovery reasons
on r-131/r-192; the original available Polish Tarator excerpt was separately reread. Supplemental
live inputs are preserved in ../recovered-recipe-sources.tgz. Both source URL typo corrections and
missing rationale provenance repairs were mechanical and did not introduce editorial decisions.
