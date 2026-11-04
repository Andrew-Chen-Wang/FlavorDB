import type { FlavorProfile } from "../types"

/**
 * Shorthand for a flavor profile, in a fixed order:
 * sweet, salty, sour, bitter, umami, spicy, numbing, smoky, rich.
 */
export const flavor = (
  sweet: number,
  salty: number,
  sour: number,
  bitter: number,
  umami: number,
  spicy: number,
  numbing: number,
  smoky: number,
  rich: number,
): FlavorProfile => ({ sweet, salty, sour, bitter, umami, spicy, numbing, smoky, rich })
