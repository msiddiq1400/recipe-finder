// ─── WHY A HARDCODED LIST? ────────────────────────────────────────────────────
// generateStaticParams runs at BUILD TIME — before any user visits the site.
// We need to know all cuisine slugs upfront so Next.js can pre-build each page.
//
// We could fetch this from the Tasty API, but cuisines don't change often
// so a hardcoded list is perfectly fine and avoids an extra API call at build time.
//
// Each entry has:
// - slug: used in the URL (/cuisines/italian) and as the Tasty API search query
// - label: displayed on the page
// - emoji: just for fun
// - description: shown on the cuisine page for SEO

export interface Cuisine {
  slug: string;
  label: string;
  emoji: string;
  description: string;
}

export const CUISINES: Cuisine[] = [
  {
    slug: 'italian',
    label: 'Italian',
    emoji: '🍝',
    description: 'From creamy pastas to crispy pizzas, explore the rich flavours of Italy.',
  },
  {
    slug: 'mexican',
    label: 'Mexican',
    emoji: '🌮',
    description: 'Bold spices, fresh ingredients and vibrant dishes from Mexico.',
  },
  {
    slug: 'chinese',
    label: 'Chinese',
    emoji: '🥡',
    description: 'Stir fries, dumplings, noodles and more from Chinese cuisine.',
  },
  {
    slug: 'japanese',
    label: 'Japanese',
    emoji: '🍱',
    description: 'Delicate flavours and beautiful presentation from Japan.',
  },
  {
    slug: 'indian',
    label: 'Indian',
    emoji: '🍛',
    description: 'Aromatic spices and hearty dishes from the Indian subcontinent.',
  },
  {
    slug: 'american',
    label: 'American',
    emoji: '🍔',
    description: 'Classic comfort food and BBQ favourites from the USA.',
  },
  {
    slug: 'french',
    label: 'French',
    emoji: '🥐',
    description: 'Elegant techniques and rich flavours from French cuisine.',
  },
  {
    slug: 'thai',
    label: 'Thai',
    emoji: '🍜',
    description: 'Fresh herbs, coconut milk and bold flavours from Thailand.',
  },
];

// Lookup map for O(1) access by slug
export const CUISINES_BY_SLUG = Object.fromEntries(
  CUISINES.map(c => [c.slug, c])
);