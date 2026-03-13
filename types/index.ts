import type { User } from '@supabase/supabase-js';

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
}

export interface SearchResult {
  id: number;
  title: string;
  image: string;
  imageType?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
}

export type { User };
