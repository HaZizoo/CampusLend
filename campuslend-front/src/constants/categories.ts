export const categories = [
  'Electronics',
  'Books',
  'Sports',
  'Musical Instruments',
  'Tools',
  'Furniture',
  'Games',
  'Other',
] as const;

export type Category = (typeof categories)[number];
