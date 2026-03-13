import { Recipe, SearchResponse } from '@/types';

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

export async function searchRecipes(query: string): Promise<SearchResponse> {
  const res = await fetch(
    `${BASE_URL}/recipes/complexSearch?query=${query}&number=12&addRecipeInformation=false&apiKey=${API_KEY}`,
    { cache: 'no-store' } // always fresh — this is what makes it SSR
  );

  if (!res.ok) throw new Error('Failed to fetch recipes');

  return res.json();
}

export async function getRecipeById(id: number): Promise<Recipe> {
  const res = await fetch(
    `${BASE_URL}/recipes/${id}/information?apiKey=${API_KEY}`,
    { next: { revalidate: 3600 } } // cache for 1 hour — recipe details rarely change
  );

  if (!res.ok) throw new Error('Failed to fetch recipe');

  return res.json();
}