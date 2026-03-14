import { TastyRecipe, TastySearchResponse } from '@/types';

const API_KEY = process.env.TASTY_API_KEY;
const BASE_URL = 'https://tasty.p.rapidapi.com';

const headers = {
  'X-RapidAPI-Key': API_KEY!,
  'X-RapidAPI-Host': 'tasty.p.rapidapi.com',
};

// Small delay to avoid hitting rate limits during build
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── SEARCH RECIPES ───────────────────────────────────────────────────────────
// Cache for 1 hour — search results for the same query won't change often.
// If user searches "pasta" twice within an hour, second call hits cache.
export async function searchRecipes(query: string): Promise<TastySearchResponse> {
  const res = await fetch(
    `${BASE_URL}/recipes/list?from=0&size=12&q=${encodeURIComponent(query)}`,
    {
      headers,
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error('Failed to search recipes');
  return res.json();
}

// ─── GET RECIPE BY ID ─────────────────────────────────────────────────────────
// Cache for 24 hours — a specific recipe almost never changes.
// /recipes/1234 will return the same data all day.
export async function getRecipeById(id: number): Promise<TastyRecipe> {
  const res = await fetch(
    `${BASE_URL}/recipes/get-more-info?id=${id}`,
    {
      headers,
      next: { revalidate: 86400 }, // 24 hours
    }
  );

  if (!res.ok) throw new Error('Failed to fetch recipe');
  return res.json();
}

// ─── GET FEATURED RECIPES ─────────────────────────────────────────────────────
// Cache for 1 hour — home page featured recipes refresh hourly.
export async function getFeaturedRecipes(): Promise<TastySearchResponse> {
  const res = await fetch(
    `${BASE_URL}/recipes/list?from=0&size=6`,
    {
      headers,
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch featured recipes');
  return res.json();
}

export async function searchRecipesByCuisine(cuisine: string): Promise<TastySearchResponse> {
  await delay(300); // wait 300ms before each request
  const res = await fetch(
    `${BASE_URL}/recipes/list?from=0&size=12&q=${encodeURIComponent(cuisine)}`,
    {
      headers,
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch ${cuisine} recipes`);
  return res.json();
}

export async function searchRecipesByTopic(slug: string): Promise<TastySearchResponse> {
  await delay(300);
  const res = await fetch(
    `${BASE_URL}/recipes/list?from=0&size=12&q=${encodeURIComponent(slug)}`,
    {
      headers,
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch ${slug} recipes`);
  return res.json();
}