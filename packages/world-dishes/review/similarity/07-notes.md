# Batch 07 manual profile review

Read all 30 exact dish records, all full methods, supplied curated names and existing WorldLinks. Output contains 26 literal profiles in input order, with four explicit deferrals below. Countries are copied exactly, even where the source's country coverage looks narrow. Taste values are qualitative cooking judgments, not measurements. Supplied source URLs are the evidence for every per-dish rationale below; no traffic/popularity claim is made.

## Deferrals requiring parent review

- Q11293688 Schnitzel: metadata calls this breaded fried meat, while the German recipe is an unbreaded veal/pork cutlet with pan jus mounted with butter. Do not silently profile the unbreaded recipe as the breaded identity. No entry pending identity/recipe choice.
- Q1147677 Sofrito: sauce metadata/country IT conflicts with a Polish recipe for braised veal cutlets, garlic, parsley and wine: this is the Corfiot dish sharing the name. No entry until the recipe association is corrected.
- Q846376 Soufflé: the supplied generic method expressly allows both sweet and savory versions with unspecified filling and optional alcohol. A single sweetness/saltiness vector would choose an unsupported variant. No entry; split representative variants or provide a specific recipe. Appropriate future form is souffle under baked, base egg.
- Q1012556 Sweet potato soup: Chinese dessert soup identity/Chinese local name conflicts with English savory stock, ginger, lime and cream soup. No entry until identity is resolved.

## Proposed vocabulary (parent must review before application)

Forms and parents:

- layered-flatbread -> [bread-based, griddled]: rolled/layered dough fried into a flat round, distinct from crepe batter.
- crisp-rice -> [rice-dish, fried-crisp]: crusted pot-cooked rice, distinct from tossed fried rice.
- eggs-in-sauce -> [in-sauce]: whole eggs set in vegetable sauce.
- thickened-soup -> [soup]: starch-thickened broth without dairy/puree; avoids calling shark-fin soup creamy.
- salad -> [cold-dish]: dressed leaves/vegetables rather than raw cubes.
- savory-pie -> [baked]: pastry-enclosed savory filling; existing pie also inherits sweets.
- raw-minced-meat -> [cold-dish]: minced raw meat rather than raw cubes or sandwiches.
- sweet-yeast-bread -> [bread-based, baked, sweets]: enriched proofed loaf, distinct from quick bread.
- frozen-dessert -> [sweets, cold-dish]: frozen dairy desserts.
- crumb-cake -> [baked, sweets]: cake layer with streusel crumb topping.
- filled-wafer -> [griddled, sweets]: thin iron-baked wafer sandwich with syrup filling.
- folded-tortilla -> [wrapped, bread-based]: open folded tortilla filling, distinct from enclosed dumpling/leaf parcel.
- cooked-egg -> [] and seasoned-egg -> [cooked-egg]: intact boiled eggs infused in seasoning liquid; served drained, not inherently a sauce dish.
- layered-dessert -> [sweets, cold-dish]: chilled cake/fruit/custard layers eaten with a spoon.
- meat-dish -> [] and poached-meat -> [meat-dish]: gently boiled meat, avoiding falsely asserting roasting or sauce service. Tête de veau is normally cut for service, but the supplied method does not explicitly slice it.
- sauce -> [] and roux-sauce -> [sauce]: a smooth stock/roux sauce, rather than pieces in sauce.
- open-faced-toast -> [bread-based]: toast topped with sauce; Welsh rarebit here is served directly, not baked pizza or closed sandwich.

Bases:

- cake -> [wheat, sweets]: prepared sponge in trifle, distinct from bread or raw pastry.
- starch -> []: gelatinized starch in lokum alongside sugar; not noodles or rice.
- stock -> []: generic stock as the defining base of velouté; chicken/veal/fish variant unspecified.

Steps:

- proof: yeast fermentation/rising of dough.
- crisp: deliberately developing a dry golden rice crust in its cooking pot, distinct from frying separated grains.
- whip: aerating the cream/condensed milk ice cream base.
- freeze: forming the frozen dessert texture.
- mince: finely chopping/grinding raw tartare.
- crack: cracking boiled eggshells before infusion creates tea-egg marbling.
- toast: dry-browning bread, distinct from generic baking/grilling.
- set: letting cooked sugar/starch confection solidify.
- make-roux: cooking flour with fat before adding liquid; shared by velouté and rarebit.

Notes:

- toasted-grain (crust browned rice), almond (stollen marzipan), vanilla (ice cream and vanilla-sugar cake), caramel (stroopwafel syrup), tea (tea eggs), brown-sugar (dry tong bat lat coating), sherry (trifle), rosewater (lokum), sugar-syrup (lokum cooked syrup), white-pepper (velouté), beer (rarebit). These are supported nonbasic flavors missing from supplied vocabulary.

## Per-id evidence and uncertainty

- Q711328 Scallion pancake: warm-water wheat dough is rolled with oil/scallion, rolled again and pan-fried gold. Wheat base, dough/fold/fry, scallion and crisp crust; salt/oil dominate, no sugar/chili. Provided 葱油饼 retained. Not curated jianbing: dough flatbread versus batter crepe.
- Q7435296 Scorched rice: rice absorbs water then low heat/oil develops a bottom crust. Rice-only base, boil/crisp sequence; toasted grain and crust, no claimed smoke or char. Supplied countries include AZ/IR/KR; optional soak omitted from defining sequence.
- Q18356332 Seafood pizza: yeast dough rolled and topped with shrimp/tuna/scallops/surimi plus tomato/chili sauce and much garlic, then baked. Bread and seafood base; modest heat because sauce strength unknown. No cheese listed, so no cheese note. Distinct from curated NY/Chicago/Detroit styles.
- Q2474644 Shakshuka: vegetables/tomato/garlic/onion cook before eggs are broken into the pan. Egg plus vegetable base and egg-in-sauce form. Recipe says green peppercorns rather than quantities of chile: zero capsaicin heat here. Country EG copied rather than expanding origins.
- Q26081 Shark Fin Soup: fin and shrimp/mushroom broth are soaked/simmered, finished with cornstarch and sesame oil. Seafood, ginger, soy, wine and broth supported; strong umami, no chile, no cream. Fin is structural base, not a noodle. Real ingredient retained.
- Q5488067 Soy sauce chicken: browned chicken parts simmer in soy/wine/ginger/sugar until reduced. Chicken braise, soy/ginger/scallion/wine and mild sweet glaze; no star anise or smoke invented. Local name 豉油雞 supplied.
- Q7577444 Spinach Salad: raw leaves with boiled egg, red onion, vinegar/mustard/Worcestershire dressing and vegetarian bacon option. Vegetable and egg base; assemble/toss/top; tangy oily dressing. No pork-fat/smoke asserted because first bacon option is vegetarian.
- Q7601887 Stargazy pie: rolled whole oily fish, breadcrumbs and bacon under pastry, with eggs/vinegar or cream. Fish and pastry base; assemble/top/bake. Profile shared fish/herbs/fat/vinegar identity; no smoke because bacon may be green or smoked. Existing potato metadata is not used as base: recipe lacks potatoes.
- Q749593 Steak tartare: raw beef minced and mixed with yolk, mustard, Worcestershire and drops of hot sauce. Raw-minced-meat form, beef base; bread is an optional serving vehicle, not what tartare is. Heat 1 only. No soy note because Worcestershire is first alternative.
- Q7617523 Tomato eggs: separately scrambled eggs are combined with briefly stir-fried tomato/scallion and reduced juices. Egg/vegetable base and stir-fried-pieces; mild sweet/sour tomato with egg, no chile or soy. 番茄炒蛋 supplied.
- Q57223 Stollen: yeast dough rests/rises, butter and dried/candied fruit/citrus/ginger added, marzipan filled and baked, sugar dusted. Wheat enriched bread base. Source's 900g sugar versus 500g flour looks suspect; sweetness reflects ordinary sweet stollen, not an endorsement of that ratio. No unilateral source correction.
- Q17119297 Strawberry ice cream: cooked strawberry syrup and fresh pieces folded into whipped cream/condensed milk/vanilla, frozen eight hours. Dairy/fruit, simmer/whip/fold/freeze, sweet rich mild berry acidity. Source repeats vanilla/salt and says only 6g cream, suspect extraction/source quantities; method clearly supports the no-churn identity. CN copied; not asserted Chinese origin.
- Q149766 Strawberry pie: strawberry/lemon/sugar filling cooked syrupy, put into crust and baked, whipped cream on serving. Pastry/fruit pie and simmer/fill/bake. Sweet/tart, fruit/citrus/cream. No butter note, since purchased crust fat is unspecified.
- Q451645 Streuselkuchen: quark/egg/flour/baking-powder batter with vanilla sugar, optional pudding or fruit under butter/sugar/flour crumbs. Wheat/dairy crumb cake; make-batter/top/bake. Existing yeast-cake metadata disagrees with this quick-leavened version; use recipe's method without claiming proofing. Profile uses vanilla sugar and dairy rather than forcing optional fruit/cinnamon.
- Q267877 Stroopwafel: yeast dough cooked in a hot waffle iron, sliced horizontally and filled with warmed butter/brown-sugar syrup. Wheat/sugar, proof/griddle/slice/fill. Rich very sweet caramel/butter; optional cinnamon contributes only broad warm-spice note, with uncertainty (can be absent).
- Q191655 Taco: Dutch recipe uses pan-fried cumin/chile ground beef in corn tortillas/hard shells, raw toppings and optional cheese/sour cream/lime. Corn/beef base, pan-fry/fill/fold. Medium-low heat 2 since chile/salsa adjustable. Form covers tortilla family; hard-shell variant is not literally folded during cooking. Not a curated duplicate.
- Q697089 Tea egg: boiled eggs cooled, shells cracked and resimmered with tea/soy/anise/cinnamon/fennel/sugar. Egg-only base, crack included because marbling is defining. Salty soy/tea/warm spice and slight bitter tannin; no chile. 茶叶蛋 supplied.
- Q328709 Tempura: very cold egg/flour batter lightly mixed, pieces dipped and deep-fried. Seafood and vegetable bases reflect ordinary mixed tempura identity and supplied options; specific recipe also permits meat, so uncertain topping mix is not forced into a meat base. Crisp crust/seafood, very low seasoning, no dipping sauce or soy invented.
- Q7811415 Toast sandwich: one toasted bread slice enclosed in two untoasted bread slices. Bread base; toast/assemble, bread/butter/black-pepper from described pan option. No cheese or meat. Optional seasonings vary; richness assumes butter method described in source and identity.
- Q17164196 Tong bat lat: glutinous rice-flour balls boiled, drained and rolled in peanut powder, sesame and brown sugar. Sticky-rice sweet-balls; no filling, soup or deep-frying. Local 糖不甩 supplied. Distinct from curated tangyuan: unfilled coated balls served drained.
- Q29960670 Tonkotsu ramen: pork bones long simmered until cloudy marrow broth, alkaline wheat noodles made/boiled, braised pork and marinated egg assembled. Noodle-only alkaline base as required; pork appears in taste notes rather than base. Richness5/umami5, no chili. Generic Ramen Q234646 already exists, but this is a materially distinctive pork-bone subtype, not the identical generic identity. No unsupported Japanese localName manufactured from Chinese translation.
- Q616601 Trifle: sherry-soaked sponge, peaches, set jelly/custard and whipped double cream layered and chilled. Cake/dairy, soak/assemble/chill/top; sherry, fruit, egg, cream. No new bake step: sponge is prepared ingredient.
- Q182339 Turkish delight: firm-ball sugar syrup combined with starch, thickened, molded/set and cut/dusted. Sugar/starch confection; rosewater and cooked syrup, very sweet, negligible fat. Nuts/coconut are optional and not used to force richness or notes. No gelatin falsely inferred from gelatinous description.
- Q1542282 Tête de veau: calf head poached gently in salted flour/vinegar blanc with herbs/pepper and beef fat. Offal base and simmer, herbs/vinegar/black-pepper; gelatinous richness. Head omitted from ingredient list but unambiguously specified in method and identity. Form proposal does not invent browning, roasting or a served sauce.
- Q58261 Velouté: white butter/flour roux, white stock and white pepper simmered until coating spoon. Generic stock base, make-roux/simmer/thicken; butter/broth/white-pepper. No cream added; not creamy soup.
- Q1210230 Welsh rarebit: butter/flour roux finished with mustard/Worcestershire/beer/cream/Cheddar and poured over toast. Bread/cheese, make-roux/thicken/top; rich salty cheese, mustard, beer and cream, slight beer bitterness. No bake/broil inferred; this source serves straight from saucepan.
