import type { User } from '@supabase/supabase-js';

export type { User };

// ─── Tasty API Types ──────────────────────────────────────────────────────────

export interface TastyRecipe {
  id: number;
  name: string;
  description: string | null;
  thumbnail_url: string;
  thumbnail_alt_text: string;
  total_time_minutes: number | null;
  cook_time_minutes: number | null;
  prep_time_minutes: number | null;
  num_servings: number;
  slug: string;
  yields: string;
  instructions: TastyInstruction[];
  sections: TastySection[];
  nutrition: TastyNutrition | null;
  tags: TastyTag[];
  topics: TastyTopic[];
  user_ratings: TastyRatings;
  total_time_tier: { display_tier: string; tier: string } | null;
  tips_summary: TastyTipsSummary | null;
}

export interface TastyInstruction {
  id: number;
  position: number;
  display_text: string;
  temperature: number | null;
  appliance: string | null;
}

export interface TastySection {
  name: string | null;
  position: number;
  components: TastyComponent[];
}

export interface TastyComponent {
  id: number;
  position: number;
  raw_text: string;
  extra_comment: string;
  ingredient: {
    id: number;
    name: string;
    display_singular: string;
  };
  measurements: TastyMeasurement[];
}

export interface TastyMeasurement {
  id: number;
  quantity: string;
  unit: {
    abbreviation: string;
    display_singular: string;
    display_plural: string;
    system: string;
  };
}

export interface TastyNutrition {
  calories: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  protein: number;
  sugar: number;
}

export interface TastyTag {
  id: number;
  name: string;
  display_name: string;
  type: string;
  root_tag_type: string;
}

export interface TastyTopic {
  name: string;
  slug: string;
}

export interface TastyRatings {
  count_positive: number;
  count_negative: number;
  score: number;
}

export interface TastyTipsSummary {
  header: string;
  content: string;
  by_line: string;
}

export interface TastySearchResponse {
  count: number;
  results: TastyRecipe[];
}

// ─── Database Row Types ───────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  recipe_id: number;
  title: string;
  image: string;
  ready_in_minutes: number | null;
  servings: number | null;
  created_at: string;
}
