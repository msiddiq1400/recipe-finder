// ─── WHY HARDCODED? ───────────────────────────────────────────────────────────
// Same reason as cuisines — we need all slugs known at BUILD TIME
// so generateStaticParams can pre-build every topic page.
// These slugs come directly from the Tasty API's topic data.

export interface Topic {
  slug: string;
  label: string;
  emoji: string;
  description: string;
}

export const TOPICS: Topic[] = [
  {
    slug: 'dinner',
    label: 'Dinner',
    emoji: '🍽',
    description: 'Satisfying dinner recipes for every night of the week.',
  },
  {
    slug: 'breakfast',
    label: 'Breakfast',
    emoji: '🍳',
    description: 'Start your day right with these breakfast recipes.',
  },
  {
    slug: 'lunch',
    label: 'Lunch',
    emoji: '🥪',
    description: 'Quick and delicious lunch ideas for busy days.',
  },
  {
    slug: 'dessert',
    label: 'Dessert',
    emoji: '🍰',
    description: 'Sweet treats and indulgent desserts for every occasion.',
  },
  {
    slug: 'pasta',
    label: 'Pasta',
    emoji: '🍝',
    description: 'From creamy carbonara to hearty bolognese.',
  },
  {
    slug: 'easy-dinner',
    label: 'Easy Dinner',
    emoji: '⚡',
    description: 'Quick weeknight dinners ready in under 30 minutes.',
  },
  {
    slug: 'meal-prep',
    label: 'Meal Prep',
    emoji: '📦',
    description: 'Batch cook your way to a stress-free week.',
  },
  {
    slug: 'one-pot',
    label: 'One Pot',
    emoji: '🥘',
    description: 'Less washing up, more eating. One pot wonders.',
  },
  {
    slug: 'salad',
    label: 'Salad',
    emoji: '🥗',
    description: 'Fresh, healthy and delicious salad recipes.',
  },
  {
    slug: 'soup',
    label: 'Soup',
    emoji: '🍲',
    description: 'Warming soups and stews for any season.',
  },
  {
    slug: 'chicken',
    label: 'Chicken',
    emoji: '🍗',
    description: 'The most versatile protein — endless chicken recipes.',
  },
  {
    slug: 'vegetarian',
    label: 'Vegetarian',
    emoji: '🥦',
    description: 'Delicious meat-free recipes packed with flavour.',
  },
];

export const TOPICS_BY_SLUG = Object.fromEntries(
  TOPICS.map(t => [t.slug, t])
);