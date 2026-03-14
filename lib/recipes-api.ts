import { TastyRecipe, TastySearchResponse } from '@/types';

const API_KEY = process.env.TASTY_API_KEY;
const BASE_URL = 'https://tasty.p.rapidapi.com';

const headers = {
  'X-RapidAPI-Key': API_KEY!,
  'X-RapidAPI-Host': 'tasty.p.rapidapi.com',
};

export async function searchRecipes(query: string): Promise<TastySearchResponse> {
  const res = await fetch(
    `${BASE_URL}/recipes/list?from=0&size=12&q=${encodeURIComponent(query)}`,
    {
      headers,
      cache: 'no-store', // SSR — always fresh
    }
  );

  if (!res.ok) throw new Error('Failed to search recipes');

  return res.json();
}

export async function getRecipeById(id: number): Promise<TastyRecipe> {
  const res = await fetch(
    `${BASE_URL}/recipes/get-more-info?id=${id}`,
    {
      headers,
      next: { revalidate: 3600 }, // cache for 1 hour
    }
  );

  if (!res.ok) throw new Error('Failed to fetch recipe');

  return res.json();
}

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
  const res = await fetch(
    `${BASE_URL}/recipes/list?from=0&size=12&q=${encodeURIComponent(cuisine)}`,
    {
      headers,
      // Cache for 1 hour — cuisine pages are static and don't need fresh data
      // This is ISR (Incremental Static Regeneration) — pages rebuild in background
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch ${cuisine} recipes`);

  return res.json();
}