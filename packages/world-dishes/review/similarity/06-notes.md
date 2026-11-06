# Batch 06 manual similarity profiles

Read all 30 complete dish records, including every supplied ingredient and recipe step, in `/tmp/flavor-profiles-input/06.json`. Profiles are reader judgments from those records; scripts only serialized literal decisions and checked coverage. All 30 receive profiles; no curated duplicate was found against the supplied 63 curated dishes and existing world links. Pizza Margherita is distinct from the curated regional pizza styles. No `localName` is emitted: these records supply Chinese translations rather than native-language names, and none was invented.

Flavor intensities are qualitative estimates for the depicted ordinary preparation, not measured values. Countries and IDs are copied from inputs. Source completeness ranking is not observed popularity. Recipe references and exact shard hashes are recorded in the source index below.

## Proposed vocabulary for parent review

New form leaves and suggested parents:

- `cured-fish`: [`cold-dish`]. Cold brined/pickled herring is neither cooked fish nor raw diced fish.
- `plain-flatbread`: [`bread-based`, `baked`]. Yeasted pita without a topping.
- `poached-egg`: [`egg-dish`], with new root `egg-dish`: []. Keep separately from soup, casserole and fried forms.
- `salad`: [`cold-dish`]. The supplied potato salad is mixed and served at room temperature.
- `yeast-bread`: [`bread-based`, `baked`]. Both pretzel and rye bread need a leavened bread leaf rather than `quick-bread`.
- `fried-filled-pastry`: [`wrapped`, `fried-crisp`]. Supports both sweet pączki and savory samosa without forcing a sweets ancestor.
- `filled-flatbread`: [`bread-based`, `wrapped`, `griddled`]. Quesadilla enclosed between tortillas, rather than a topped baked bread.
- `pudding`: [`sweets`]. Set rice pudding is distinct from savory porridge and rice cake.
- `whole-roast`: [`baked`]. Roast chicken is served as a whole bird, unlike the existing sliced roast form.
- `frozen-dessert`: [`sweets`, `cold-dish`]. Ice cream is distinct from room-temperature confection.
- `fruit-soup`: [`soup`, `sweets`]. Sweet, tart rose hip soup should not inherit a savory cream soup form.
- `raw-slices`: [`cold-dish`]. Sashimi is sliced rather than cubed, and is not cured.

New base nodes and suggested parents:

- `nuts`: []; `peanut`: [`nuts`]. Pecan pie and peanut butter sandwich need their defining nut bases; peanut is a culinary nut here.
- `pumpkin`: [`vegetable`]. Main substance of pumpkin soup.
- `rye`: [`grain`]. Existing `bread` inherits wheat, which would falsely classify the supplied pure rye bread recipe.

New steps: `cure` (brine without cooking), `pickle` (vinegar marinade), `proof` (yeast dough rises), `poach` (egg below a rolling boil), `puree` (smooth pumpkin/rose hip soup), `reduce` (rendang coconut liquid cooks down), `freeze` (ice cream), `ferment` (long sourdough rye fermentation).

New notes: `nutty`, `vanilla`, `yeast`, `alkaline`, `pumpkin`, `onion`, `coconut`, `rhubarb`, `pastry`, `milk`, `sourdough`, `ginseng`. These describe flavors explicitly supported by ingredients or the ordinary identity; no ingredient matcher inferred them. Parent may harmonize spelling with semantically equivalent vocabulary proposed by other readers.

## Per-dish evidence, rationale and uncertainty

1. **Q1369093 Peanut butter and jelly sandwich**: White bread, peanut butter and jelly are spread and assembled, with no cooking. Bread/peanut bases and peanut/fruit/bread notes reflect the supplied recipe. Sweet 4, rich 3 from preserves and peanut butter; no invented grilling step.
2. **Q1284379 Pecan pie**: Butter/shortening pastry is blind baked, filled with roasted pecans, egg, sugar and corn syrup, and baked again. The repeated bake step represents those two actual phases. Very sweet and rich; nutty/vanilla/butter notes. Boiling syrup briefly is not evidence of caramelization, so that step is absent.
3. **Q695101 Pickled herring**: Overnight brine, then cooled vinegar, sugar and warm spices. Only the pickle liquid is boiled, not the fish. Cold cured form with cure/pickle/chill steps; salty and sour 4. Mustard is among the supplied pickle spices. Variant spice mixtures can differ.
4. **Q485796 Pilaf**: Rice is fried in butter and cooked covered with broth; supplied Spanish recipe finishes in an oven. Profile uses the ordinary absorption-method simmer after frying; broth/butter notes and rice alone as main base. Broad pilaf identity does not justify forcing meat or chili into every serving. Oven-finishing is a recipe-specific variation, so exact-method similarity is less certain here.
5. **Q211340 Pita**: Yeast flour dough rises and bakes as plain rounds. Plain-flatbread leaf, bread base, proof and bake; bread/yeast notes. Not a quick bread or topped pizza form.
6. **Q500724 Pizza Margherita**: Proofed dough topped with tomato, mozzarella and basil, then baked. Bread/cheese bases and tomato/cheese/herbs/bread notes. Distinct from curated New York, Detroit and deep-dish pizzas.
7. **Q4992018 Po' boy**: Supplied generic recipe allows roast beef, ham, turkey or fried seafood with lettuce/pickles and condiments in French bread. Generic meat/bread sandwich and assembly only; no universally valid deep-fry step or seafood note. Chinese translation names an oyster variant, but the English identity and full recipe are broader. Condiments make pickle/mustard notes defensible; flavor varies substantially by filling.
8. **Q1363043 Poached egg**: Egg cooked at 70–80 C, 2–3 minutes, with optional vinegar. Poach rather than boil, egg base, low salt and moderate yolk richness. **One-note exception: `egg` alone.** Adding soy, herbs, broth or butter to reach two notes would fabricate flavors. Optional vinegar is deliberately excluded from the ordinary taste profile.
9. **Q152964 Potato salad**: Supplied recipe is vinegar/bacon/hard-boiled-egg salad, with cooked flour-thickened dressing; it is not a mayonnaise recipe. Potato base, boil/thicken/toss, vinegar/pork-fat/herbs/egg notes. Sour 3 and smoky 1 reflect this particular bacon variant; many national versions differ.
10. **Q2920954 Potjiekos**: Meat is browned, layered with vegetables/potatoes and slowly braised without stirring. Meat and potato bases avoid guessing a single animal from a recipe allowing many. Garlic, warm spice, broth and cream are supplied. Fire-pot identity alone does not establish a smoky flavor.
11. **Q396184 Poutine**: Double-fried potatoes topped with gravy and cheese curds. Existing fried-pieces leaf is adequate, with potato/cheese bases and cheese/broth/fried-crust notes. Rich 5, salty 4. No extra cheese-melting bake step.
12. **Q160525 Pretzel**: Yeast dough rises, shaped ropes briefly boil in bicarbonate water, then bake. Yeast-bread form and make-dough/proof/boil/bake capture the process; alkaline/bread/yeast notes. Salt 4, slight bitterness, no chili heat.
13. **Q1797271 Pumpkin soup**: Description identifies a pureed soup, but the supplied vegetable/chickpea recipe ends after simmering chunks and omits blending. Profile follows the ordinary pureed identity using creamy-soup (texture, not dairy), pumpkin base, pan-fry/simmer/puree, pumpkin/onion notes. **Identity/recipe discrepancy for parent review:** puree is supported by description rather than that particular recipe. No dairy note or high richness is inferred.
14. **Q3411527 Pâté chinois**: Ground beef, corn and mashed potato layered and baked. Casserole with potato/beef bases; corn and black pepper notes. Boiling potatoes, frying beef, assembly and baking are all explicit. No pastry base despite the translated name resembling a pie.
15. **Q2186681 Pączki**: Enriched yeasted dough flavored with citrus/vanilla, filled with jam and deep fried. New fried-filled-pastry form avoids conflating it with baked pastry. Fill occurs before fry in the supplied recipe; other variants fill later. Sweet 4, rich 4, citrus/fruit/vanilla/fried-crust notes.
16. **Q865325 Quesadilla**: Supplied preparation encloses cheese between flour tortillas and heats on a griddle. Filled-flatbread with bread/cheese bases; fill/griddle and cheese/bread notes. Optional salsa/peppers are not mandatory heat; spicy 0. Some regions use corn tortillas, but this recipe is wheat.
17. **Q1520293 Rendang**: Beef is marinated with spice paste and braised as coconut milk is repeatedly added and reduced for at least 1.5 hours. Beef base, braised-chunks and marinate/braise/reduce. Coconut, chili, ginger, garlic, citrus aromatics and warm spice notes. Citrus comes from leaves/lemongrass, not necessarily sour juice, so sour stays 0. Heat 3 and rich 4 are estimates.
18. **Q3180957 Reuben sandwich**: Corned beef, Swiss cheese, sauerkraut and Russian dressing on buttered rye, pan griddled. Bread/beef bases and pickle/cheese/butter/bread notes. Pan griddling does not warrant smoke. Pastrami is an optional variation, not the baseline smoky profile.
19. **Q5256427 Rhubarb pie**: Sweetened rhubarb in baked pastry; sweet 4 and sour 4 preserve the defining contrast. Pastry/fruit bases use culinary fruit grouping. Rhubarb and pastry notes avoid inventing butter where the crust recipe is only linked, not included.
20. **Q19029 Rice pudding**: Supplied recipe combines cooked rice, milk, eggs, vanilla and warm spice, then sets in an oven water bath. Pudding with rice/dairy bases and assemble/bake. Milk/warm-spice/vanilla notes. Broad world identity includes stovetop and egg-free versions; this profile intentionally follows the supplied baked variant.
21. **Q860465 Roast beef**: Beef joint is peppered/floured, seared, roasted, rested and carved; gravy includes broth/Worcestershire/mustard. Roast-sliced with beef base and pan-fry/roast/slice; black-pepper/broth/mustard notes. Potatoes are a side and are excluded from main base/method. No inferred smoke.
22. **Q899640 Roast chicken**: Whole chicken roasted with lemon, olive oil, salt and pepper. Whole-roast/chicken/roast and citrus/black-pepper notes. **Description error:** text mentions boiled/fried meat, contradicted by the name and complete roasting recipe; recipe governs this profile.
23. **Q7356051 Rocky road ice cream**: Chocolate milk/cream/vanilla ice cream with almonds or pecans and marshmallows, churned/frozen. Frozen-dessert with dairy/chocolate bases and freeze; chocolate/cream/nutty/vanilla notes. Sweet/rich 5, cocoa bitterness 1. The existing steps lack churning, so freeze captures the essential transformation without pretending this is a boiled confection.
24. **Q904185 Rose hip soup**: Rose hips boil, pulp is strained/pureed, sugar added and liquid thickened with potato flour; almonds supplied. Sweet/tart fruit-soup, fruit base, boil/puree/thicken, fruit/nutty notes. Not cream soup. Supplied countries look broad/odd but are copied unchanged; no country judgment was part of this task.
25. **Q1993581 Rugelach**: Butter/cream-cheese dough chilled 12–24 hours, filled with jam, walnuts, raisins and cinnamon, rolled, baked and sliced. Filled-pastry with pastry base; make-dough/chill/fill/wrap/bake/slice. Butter/cheese/fruit/warm-spice/nutty notes. Found image is a chocolate variant, but the supplied recipe is fruit/nut and governs this profile. No laminated croissant technique inferred.
26. **Q3893120 Rye bread**: Supplied Danish recipe uses rye flour/cracked rye and sourdough starter, fermented in long stages and baked. Rye base avoids existing bread's wheat ancestry. Yeast-bread form, make-dough/ferment/bake, bread/sourdough notes. Sour 3 and bitter 1. Other rye breads may contain wheat; this supplied recipe does not.
27. **Q1244010 Saganaki**: Kefalotyri slices egg/flour coated and pan fried, finished with lemon. Fried-pieces/cheese, coat/pan-fry; cheese/citrus/fried-crust notes. High salt/richness. No flambé step: that is not the supplied preparation.
28. **Q1335219 Samgyetang**: Chicken stuffed with cooked sticky rice, garlic and jujubes, then simmered with water/leek. Clear-soup/chicken, fill/simmer; garlic/broth/ginseng notes. **Definition/recipe variation:** ginseng is explicit in the dish definition and ingredients but absent from the particular recipe; ordinary identity supports ginseng note and slight bitterness. No invented chili, soy or sesame.
29. **Q491517 Samosa**: Potato/pea filling is steamed and pan fried with chili, onion and herbs; stiff flour dough is filled, folded into pyramids and deep fried. Fried-filled-pastry, pastry/potato bases, steam/pan-fry/make-dough/fill/fold/deep-fry. Chili/herbs/fried-crust notes, spicy 2. **Description error:** says baked, but complete recipe explicitly deep fries. No unspecified cumin/curry added.
30. **Q190715 Sashimi**: Supplied recipe is fish sliced thinly across the grain, with no mandatory sauce or accompaniments. Raw-slices/fish/slice; moderate natural umami. **One-note exception: `seafood` alone.** No rice, soy sauce, wasabi or citrus is fabricated to meet the note-count minimum.

## Review decisions requiring attention

Two profiles deliberately contain one note rather than the recommended two-note minimum: plain poached egg and plain sashimi. Their evidence supports only a single flavor identity. Parent can accept these honest exceptions or defer these two profiles; adding a second flavor would make them less accurate.

Parent should review new graph/step/note vocabulary before applying, plus the explicit recipe/description mismatches in pumpkin soup, roast chicken and samosa, and the ginseng recipe omission in samgyetang. No dishes were skipped, no tracked source data was edited, and this output does not itself establish any rendered-page behavior.

## Exact source index

- Q1369093 Peanut butter and jelly sandwich: `packages/world-dishes/data/dishes-02.jsonl:1990`, SHA-256 `baed58ba385812583466558ad75d78b3e2017af26c719a0329f9539c86c8d2bd`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3APeanut_Butter_and_Jelly_Sandwich

- Q1284379 Pecan pie: `packages/world-dishes/data/dishes-02.jsonl:828`, SHA-256 `f30777bdb7314235379c89055559340fa1be09fc20dd05b20ca8c22391ca45da`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3APecan_Pie

- Q695101 Pickled herring: `packages/world-dishes/data/dishes-06.jsonl:959`, SHA-256 `2a6e9679b69ce2124793a23a20cb1577ea157a5d87bbcadc04949c8db4698f54`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3APickled_Herring

- Q485796 Pilaf: `packages/world-dishes/data/dishes-05.jsonl:913`, SHA-256 `47aca0d4d4849509b820dedfd77009e105d19aa22c2d0e68b3de81c550c7eeea`. Recipe: https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FPilaf

- Q211340 Pita: `packages/world-dishes/data/dishes-03.jsonl:2466`, SHA-256 `4e0cb5915d94b26001c1f9a03fac811426a81c89827f58ff99a167b7a0b5699f`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3APita

- Q500724 Pizza Margherita: `packages/world-dishes/data/dishes-05.jsonl:1147`, SHA-256 `f19b0cace3130e41aeccae6433a242d322f7f7f699c304d48ef4ed5977d5bba7`. Recipe: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FPizza_Margherita

- Q4992018 Po' boy: `packages/world-dishes/data/dishes-05.jsonl:1115`, SHA-256 `2fee51b580c0e6d13c7b8070a5788ec2afabce663327eaf3d1bacf6e25b5a077`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3APo'_Boy

- Q1363043 Poached egg: `packages/world-dishes/data/dishes-02.jsonl:1873`, SHA-256 `a4e141d92b9c0abbd1cf4fe0b8e7909cd34f7f711442affbaeceb3c71e58a17c`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3APoached_Egg

- Q152964 Potato salad: `packages/world-dishes/data/dishes-03.jsonl:464`, SHA-256 `58eac26d1fd40d2aa0093f433b17296462926033b400e3f8eed76c64c726c8f8`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3APotato_Salad

- Q2920954 Potjiekos: `packages/world-dishes/data/dishes-04.jsonl:1418`, SHA-256 `7ce9900834982b1d280c7cc3344597fa4ab3fd01bc910fb9496536082f7ed6ec`. Recipe: https://nl.wikibooks.org/wiki/Kookboek%2FPotjiekos

- Q396184 Poutine: `packages/world-dishes/data/dishes-05.jsonl:381`, SHA-256 `5a32adc60613d09655f7e474d1f83c678e176e966dfe2a2ca14bad309cbe9217`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3APoutine

- Q160525 Pretzel: `packages/world-dishes/data/dishes-03.jsonl:711`, SHA-256 `8fe6fe4684f9ee619b1d69f7c52652e1136e344f2efc37b7792db96c6b861b48`. Recipe: https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FPretzel

- Q1797271 Pumpkin soup: `packages/world-dishes/data/dishes-03.jsonl:1568`, SHA-256 `d35c80cdead9125e426a17e2ac3d39ca47e56aada7330843cd72cf10cb029ead`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3APumpkin_Soup

- Q3411527 Pâté chinois: `packages/world-dishes/data/dishes-04.jsonl:2198`, SHA-256 `f0b658da031da56e9e69b4606e75cf8c9c6996f8a4e03810de0742d75785f3d5`. Recipe: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FP%C3%A2t%C3%A9_chinois

- Q2186681 Pączki: `packages/world-dishes/data/dishes-04.jsonl:85`, SHA-256 `e2f100c9b0a8e1f10c153e399f9d43daf3d561812556a427121b2e7250c4beef`. Recipe: https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FP%C4%85czki

- Q865325 Quesadilla: `packages/world-dishes/data/dishes-06.jsonl:2024`, SHA-256 `94afd209fbf929c127fca7281ade2f71dd0ef50a875c1b878f25537744a6bc51`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3AQuesadilla

- Q1520293 Rendang: `packages/world-dishes/data/dishes-03.jsonl:442`, SHA-256 `d329465c85afa84e423f3e26028cf015c529756613a4b21b61c8f33c4b5220c8`. Recipe: https://nl.wikibooks.org/wiki/Kookboek%2FRendang

- Q3180957 Reuben sandwich: `packages/world-dishes/data/dishes-04.jsonl:1889`, SHA-256 `c42e4be8426e78ae2159d98e0e678a5e0c511d572b1467c1614edb947ed8e198`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3AReuben_Sandwich

- Q5256427 Rhubarb pie: `packages/world-dishes/data/dishes-05.jsonl:1423`, SHA-256 `4d123c81623d50f8fb3ba865b44c2741e4989f4e11129e98c295da81a79a28b8`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ARhubarb_Pie

- Q19029 Rice pudding: `packages/world-dishes/data/dishes-03.jsonl:1831`, SHA-256 `d77ba0c2d0b89da657566e9564ef2de8ef45c61eadfb0f4b168e4eda327f644c`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ARice_Pudding

- Q860465 Roast beef: `packages/world-dishes/data/dishes-06.jsonl:2004`, SHA-256 `1b2a874944258e427de8e9861038bcadbb9876fdfbe81ffefa819e2b98227437`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ARoast_Beef

- Q899640 Roast chicken: `packages/world-dishes/data/dishes-06.jsonl:2199`, SHA-256 `18d4b4f8831e8ed05c50bb196f3f6f8d043738512786d66df9c5c73c088227cb`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ARoast_Chicken

- Q7356051 Rocky road ice cream: `packages/world-dishes/data/dishes-06.jsonl:1341`, SHA-256 `c7487972d12dc2e688d6b4459365e93378c81387e3ba0c5fb901c732ee1306b7`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ARocky_Road_Ice_Cream

- Q904185 Rose hip soup: `packages/world-dishes/data/dishes-06.jsonl:2244`, SHA-256 `7c8211a18e93acff1568e7d3788d3f361b5acc0154c8ab7d43be27a4b0fd7371`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ARosehip_Soup

- Q1993581 Rugelach: `packages/world-dishes/data/dishes-03.jsonl:2050`, SHA-256 `04711540002e6cf9258f935e29dcb1042a7a9461f1b670e2a5ed83599697c2bb`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ARugelach

- Q3893120 Rye bread: `packages/world-dishes/data/dishes-05.jsonl:220`, SHA-256 `934ff0094433cad7cb94674574ae5698d3c7da216dda004546f0480f384e9834`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ARye_Bread

- Q1244010 Saganaki: `packages/world-dishes/data/dishes-02.jsonl:279`, SHA-256 `0c0aefced706dcbe2b412917ee137ae4f9229c6abe8b9c7bba6b7ccc6d722529`. Recipe: https://es.wikibooks.org/wiki/Artes_culinarias%2FRecetas%2FSaganaki

- Q1335219 Samgyetang: `packages/world-dishes/data/dishes-02.jsonl:1501`, SHA-256 `7a43a1c3eb6712cc896eb7a2430fa899b6c271109ce9b8d061b1c07e2c4e1120`. Recipe: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FSam_gye_tang

- Q491517 Samosa: `packages/world-dishes/data/dishes-05.jsonl:1038`, SHA-256 `f8f9d085a4780ce85dccdea809db28cb9f5623435c297f40ae175b1c0313e1bb`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ASamosa

- Q190715 Sashimi: `packages/world-dishes/data/dishes-03.jsonl:1834`, SHA-256 `f70c3c471631f0b97f3e08a0cc48e0ac4dbc34a8631bb8c489bb6074e299a6a5`. Recipe: https://en.wikibooks.org/wiki/Cookbook%3ASashimi
