# Batch04 manual profile review

Read all30 full supplied dish records, including every recipe's ingredients and method. Produced28 literal profiles and2 justified identity-conflict skips. Flavor values are qualitative judgments of the described preparation, not measured nutrient or taste data. No localName was added: supplied alternate names were Chinese translations for these dishes rather than names in their own local script.

## Proposed vocabulary

These proposals are deliberately explicit; parent review must add/merge them before typechecking the entries. Similar proposals from other batches can share a single canonical vocabulary.

```json
{
  "formGroups": { "composed-dish": [], "dough-dish": [] },
  "forms": {
    "stuffed-tortilla": ["wrapped", "baked"],
    "plated-meal": ["composed-dish"],
    "toasted-crumbs": ["fried-crisp"],
    "steamed-pudding": ["sweets"],
    "yeast-bread": ["bread-based", "baked"],
    "salad": ["cold-dish"],
    "baked-bread": ["bread-based", "baked"],
    "rice-roll": ["rice-dish", "wrapped", "cold-dish"],
    "cake": ["baked", "sweets"],
    "unfilled-dumplings": ["dough-dish"],
    "savory-pudding": ["wrapped"],
    "cracker": ["bread-based", "baked"],
    "creamy-sauce": ["in-sauce"],
    "thickened-soup": ["soup"],
    "pickled-vegetables": ["cold-dish"]
  },
  "bases": {
    "cassava": [],
    "nuts": [],
    "almond": ["nuts"],
    "oats": ["grain"],
    "bulgur": ["wheat"]
  },
  "steps": ["proof", "cure", "microwave", "emulsify", "ferment"],
  "notes": ["olive-oil", "vanilla", "juniper", "almond", "rum", "onion"]
}
```

`yeast-bread` avoids incorrectly treating leavened focaccia, hot cross buns, and kerststol as quick bread. `baked-bread` covers reheated/topped existing loaves, not dough making. `unfilled-dumplings` avoids labeling potato gnocchi as either noodles or a wrapped filling. `thickened-soup` is a starch-thickened broth, without the dairy implied by creamy soup. `toasted-crumbs` describes farofa's dry, toasted granular serving form. `creamy-sauce` covers emulsified pourable sauce, distinct from pieces in sauce. `composed-dish` and `dough-dish` are broad roots needed because no existing root describes those serving forms honestly.

## Per-dish rationale and uncertainty

- Q876096 Enchilada: Dutch source explicitly contrasts oven cooking with grilled quesadillas; tortilla, minced meat, spicy tomato sauce and cheese support filled/rolled/baked form, corn/meat base and moderate chili, tomato and cheese. Recipe is explanatory rather than a detailed timed procedure, but description independently supports rolled corn tortilla and chili sauce. Meat species is unspecified, so base is `meat`, not invented beef.
- Q73989 English breakfast: full recipe grills sausage, tomato and bacon, gently simmers eggs and pan-fries mushrooms, then plates with toast. Pork and egg dominate; tomato/bread are secondary notes. Bacon is explicitly best smoked, giving only a modest smoke intensity. This is a composed plate, not a sandwich or stew.
- Q1397036 Farofa: garlic, onion and fatty meat are fried, cassava flour then toasted golden. Cassava is the defining base; the seasoning blend supports restrained warm spice and mild heat. Optional cilantro supports an herb note, without treating garnish as the base.
- Q878189 Feijoada: French source cooks salted/smoked meats and beans, brings them together in broth with herbs. Beans and pork remain the bases despite multiple beef/sausage components and accompanying rice. Orange and hot sauce are served separately, so intrinsic sourness and heat stay low. Moderate smoke reflects explicitly smoked meat/bacon.
- Q15932560 Figgy pudding: breadcrumbs and a large fig quantity, butter, citrus peel and baking spices are steamed in a water bath in the oven. Form is steamed pudding, not generic baked cake. Optional crushed bacon and hard-sauce drizzle do not define its ordinary taste.
- Q203925 Fish and chips: flour/starch batter coats fish; both fish and thick-cut potatoes are deep-fried. Those two bases and crisp-fry method define the plate. Lemon and malt vinegar are explicit finishers, reflected at moderate sourness, with no invented chili heat.
- Q832791 Focaccia: Italian recipe develops a starter, kneads, gives a long rise and bakes a shallow dough with coarse salt and olive oil. Yeast bread form and proof step distinguish it from quick bread. Optional onion/wine variants omitted from the default profile. Olive oil is a real defining note, not butter.
- Q244617 French onion soup: onion is blonded, flour slightly thickens stock, soup simmers, then bread and Gruyère are broiled on top. Clear-soup form represents broth rather than cream; the small flour quantity does not make it thick stew. Onion sweetness and stock/cheese umami are strong. No heavy caramelize step because the recipe explicitly warns against dark caramelization.
- Q1756289 Fried bread: SKIPPED. World metadata describes slices of existing bread shallow-fried as toast. Attached recipe instead mixes self-rising flour with milk and fries spoonfuls of batter, producing a different fritter/quick bread. A profile would choose between incompatible identities without adequate support; parent should separate/relink recipe before profiling.
- Q209304 Gado-gado: Dutch recipe boils beans/egg, gently cooks cabbage, blanches sprouts and serves peanut sauce, rice and krupuk. Vegetable/egg salad remains distinct from rice as the accompanying starch. Peanut note is essential; seafood comes from prawn crackers. Peanut sauce composition is unspecified, so sourness/heat are kept low and no detailed spice/fermentation notes invented.
- Q1359006 Garlic bread: source cuts an existing loaf, coats it in garlic butter and warms it wrapped in foil. Baked-bread form and no make-dough step preserve this difference from yeast bread made from scratch. Garlic/butter dominate; cheese is absent.
- Q495360 Gimbap: blanched spinach, stir-fried carrot, pan-cooked omelette and cooked meat/fish are rolled with seasoned rice in seaweed and sliced. Rice is its single base. Sesame/pickled radish/egg/seaweed and optional tuna support flavor notes. No vinegar-rice assumption: recipe uses sesame oil and salt, unlike sushi.
- Q178600 Gingerbread: broad record has an actual soft cake recipe, not cut-out cookies. Syrup/butter and ginger mixed spice batter bake in a cake tin and are sliced into squares. Profile describes that supplied cake variant; uncertainty: other gingerbread identities may need distinct dish records later.
- Q20063 Gnocchi: recipe boils potatoes, makes potato/flour/egg dough, forms unfilled small cylinders and boils them. Potato base rather than ordinary wheat pasta. Only one honest secondary note (`egg`) is supplied: no sauce, cheese, garlic or sage is in this recipe. Parent explicitly permitted a one-note exception to avoid fabrication. Plain profile will have limited taste discrimination.
- Q1057717 Gooey butter cake: cake-mix/egg/butter forms a firm crust, cream-cheese/egg/sugar filling is poured on and baked. Cake form with wheat/dairy base; extremely sweet and rich, slight cream-cheese tang. Vanilla is explicit. This is the modern cake-mix variant, not a reconstruction of yeast-raised originals.
- Q252630 Gravlax: salmon is salt/sugar cured with juniper, white pepper and dill for four days, chilled then thinly sliced. `cure` is indispensable; ordinary marinate alone understates this transformation. Gin is optional, so no alcohol note added. No smoke because this is cured raw fish, not smoked salmon. Juniper is an actual substantial aromatic ingredient.
- Q240801 Greek salad: raw tomato/cucumber/onion/pepper/olive are tossed with oil and acid, feta placed on top and oregano added. Vegetable/cheese base, strong tomato/feta/herb character, restrained olive bitterness and moderate dressing sourness. No cooking steps.
- Q681596 Gyros: SKIPPED. Metadata/description identify vertical-spit roasted sliced meat served in pita. Polish attached recipe marinates pork strips and quickly pan-fries, serving fries/salad/tzatziki without bread. Both are legitimate culinary usages, but selecting one method/form for the combined record would conceal a material identity/recipe mismatch.
- Q683495 Gâteau Basque: chilled enriched short dough encloses cooked almond/lemon/vanilla pastry cream before baking. Existing filled-pastry form fits; pastry/dairy bases and rum/almond/citrus/vanilla/butter/cream notes are directly supported. Some versions use cherries; this recipe is explicitly custard, so no cherry/fruit filling note assumed.
- Q20723323 Gâteau nantais: almond powder, butter, eggs and a little flour make a cake, soaked with rum and finished with rum icing. Almond is more defining than the small flour quantity, so bases almond/wheat; intense sweetness, butter/almond richness, and explicit rum note. No chocolate.
- Q209500 Haggis: source simmers offal/meat, coarsely grinds with toasted oatmeal/herbs, fills beef caps and steams. Offal and oats are defining bases; casing-enclosed savory pudding is different from a leaf parcel. Recipe is an adapted beef-cap/heart/liver preparation, not only sheep-stomach tradition. Whisky/eggnog are minor; no unsupported smoke or chili.
- Q1572563 Ham and eggs: Hungarian recipe lays ham in buttered dish then microwaves seasoned eggs over it. Pork/egg plated meal with explicit microwave step preserves supplied method instead of falsely assigning pan-frying. Ordinary ham can be smoky, but intensity only1; paprika in source is not assumed hot. If parent prefers a broadly canonical frying profile, more source evidence is required.
- Q836891 Hardtack: flour/water/salt dough bakes, is cut/pierced, flipped and baked again for dryness. Cracker form, wheat base, double bake. Bread is the only honest note; single-note exception avoids fabricated butter, nuts, spice or egg. Salt is optional, so low salt intensity; almost no richness.
- Q58259 Hollandaise sauce: butter incorporated into yolk/lemon mixture and whisked over simmering water until thick. Emulsify/thicken capture defining transformation; dairy/egg base. Butter/citrus/yolk dominate; tiny cayenne gives only1 heat. Not a soup, and no chunks to justify pieces-in-sauce.
- Q711494 Hot and sour soup: stock, tofu, mushrooms/bamboo, shredded meat simmer; cornstarch thickens and egg is streamed in. Thickened-soup form avoids implying dairy. Tofu/vegetable base represents solids, stock supplies broth/umami; vinegar and white/black pepper produce conspicuous sourness/heat with chili sauce, sesame and soy notes. Pepper heat is not Sichuan numbing.
- Q1601611 Hot cross bun: milk/yeast dough is kneaded and proofed twice, baked and glazed, with currants/cinnamon/nutmeg. Base bread/fruit and sweet yeast-bread form; mild warm spice rather than chili. No invented citrus, absent from this recipe.
- Q755730 Irish stew: mutton, potato, onion/carrot and parsley are layered with water and simmered slowly until potato thickens liquid. Lamb/potato base, thick stew, single simmer step. No browning, wine or tomato in the source, so none inferred. Natural onion/carrot sweetness is low.
- Q2779348 Kerststol: rum-soaked fruit is incorporated into enriched yeast dough, proofed, folded round almond filling, proofed again and baked. Bread/fruit bases retain its identity; almond, rum, butter and citrus are strong supported notes. Do not treat it as an unleavened filled pastry merely because it encloses almond paste.
- Q1644022 Kibbeh: source is a boiled, optionally pan-fried stuffed bulgur/semolina dumpling. Profile uses stated primary boiled version: meat filling fried first, bulgur soaked, dough kneaded, filled then boiled. Bulgur/meat bases; onion and mild turmeric warm spice. No mandatory deep-fry step or crispness note because those are not the default recipe. Broader kibbeh includes other forms; this is a clearly documented recipe variant.
- Q141898 Kimchi: Portuguese source salts Napa cabbage, coats with chili/garlic/ginger/fish sauce and vegetables, wraps leaves, rests overnight then chills for days. Fermentation/pickle identity is explicit in description and resting method. Vegetable base and cold pickled form; assertive chili, sourness and garlic, no numbing. Sourness varies with fermentation age, so4 describes a mature typical serving rather than freshly mixed cabbage.

## Evidence mapping

Every rationale above refers to the exact full recipe and world metadata in batch04. The following per-id URLs make those inputs independently locatable; no network research was used for these judgments.

- Q876096: https://nl.wikibooks.org/wiki/Kookboek%2FEnchilada
- Q73989: https://en.wikibooks.org/wiki/Cookbook%3AEnglish_Breakfast
- Q1397036: https://en.wikibooks.org/wiki/Cookbook%3AFarofa
- Q878189: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FFeijoada
- Q15932560: https://en.wikibooks.org/wiki/Cookbook%3AFiggy_Pudding
- Q203925: https://en.wikibooks.org/wiki/Cookbook%3AFish_and_Chips
- Q832791: https://it.wikibooks.org/wiki/Libro_di_cucina%2FRicette%2FFocaccia
- Q244617: https://en.wikibooks.org/wiki/Cookbook%3AFrench_Onion_Soup
- Q1756289: https://en.wikibooks.org/wiki/Cookbook%3AFried_Bread
- Q209304: https://nl.wikibooks.org/wiki/Kookboek%2FGado_gado
- Q1359006: https://en.wikibooks.org/wiki/Cookbook%3AGarlic_Bread
- Q495360: https://en.wikibooks.org/wiki/Cookbook%3AGimbap
- Q178600: https://en.wikibooks.org/wiki/Cookbook%3AGingerbread
- Q20063: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FGnocchi
- Q1057717: https://en.wikibooks.org/wiki/Cookbook%3AGooey_Butter_Cake
- Q252630: https://en.wikibooks.org/wiki/Cookbook%3AGravlax
- Q240801: https://en.wikibooks.org/wiki/Cookbook%3AGreek_Salad
- Q681596: https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FGyros
- Q683495: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FG%C3%A2teau_basque
- Q20723323: https://fr.wikibooks.org/wiki/Livre_de_cuisine%2FG%C3%A2teau_Nantais
- Q209500: https://en.wikibooks.org/wiki/Cookbook%3AHaggis
- Q1572563: https://hu.wikibooks.org/wiki/Szak%C3%A1csk%C3%B6nyv%2FEl%C5%91%C3%A9telek%2FMeleg_el%C5%91%C3%A9tel%2FHam_and_eggs
- Q836891: https://en.wikibooks.org/wiki/Cookbook%3AHard_Tack
- Q58259: https://en.wikibooks.org/wiki/Cookbook%3AHollandaise_Sauce
- Q711494: https://en.wikibooks.org/wiki/Cookbook%3AHot_and_Sour_Soup
- Q1601611: https://en.wikibooks.org/wiki/Cookbook%3AHot_Cross_Bun
- Q755730: https://en.wikibooks.org/wiki/Cookbook%3AIrish_Stew
- Q2779348: https://pl.wikibooks.org/wiki/Ksi%C4%85%C5%BCka_kucharska%2FKerststol
- Q1644022: https://en.wikibooks.org/wiki/Cookbook%3AKibbeh
- Q141898: https://pt.wikibooks.org/wiki/Livro_de_receitas%2FKimchi
