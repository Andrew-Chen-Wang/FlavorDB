/**
 * Wikidata files beers, wines and other drinks under "food". FlavorDB is about dishes, so drinks
 * are left out, matched by the label of their type ("New England India Pale Ale", "wine", …).
 */
const DRINK =
  /\b(beer|ale|ipa|stout|lager|pilsner|pils|porter|saison|tripel|dubbel|quadrupel|bock|witbier|weisse|weizen|helles|märzen|radler|gueuze|lambic|gose|kölsch|blond|barley wine|winter warmer|wine|whisky|whiskey|vodka|liqueur|spirit|cider|brandy|gin|rum|sake|drink|beverage|cocktail|mead|soft drink|soda|juice|mineral water|smoothie|kombucha|tea|coffee)\b/i

export const isDrink = (typeLabel: string) => DRINK.test(typeLabel)
