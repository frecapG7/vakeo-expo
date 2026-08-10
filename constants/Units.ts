// Common French grocery units for autocomplete
export const GROCERY_UNITS = [
    'pièce',
    'unité',
    'kg',
    'g',
    'L',
    'cL',
    'mL',
    'boîte',
    'sachet',
    'bouteille',
    'pot',
    'barquette',
    'paquet',
] as const;

export type GroceryUnit = typeof GROCERY_UNITS[number];
