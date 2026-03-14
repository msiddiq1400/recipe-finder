import { supabase } from '@/lib/supabase';
import { getRecipeById } from '@/lib/recipes-api';
import { TastyRecipe } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

// ─── ISR: INCREMENTAL STATIC REGENERATION ────────────────────────────────────
// This page is statically generated BUT rebuilds automatically in the background
// every hour. This is the best of both worlds:
// - Fast like SSG (pre-built HTML served instantly)
// - Fresh like SSR (data updates periodically without a full redeploy)
//
// `revalidate` tells Next.js: "rebuild this page in the background
// if it's been more than 3600 seconds since the last build"
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Popular Recipes',
  description: 'The most saved recipes by our community.',
};

export default async function PopularPage() {

  // ─── STEP 1: Get most saved recipe IDs from Supabase ─────────────────────
  // Count how many times each recipe_id appears in the favorites table
  const { data: topFavorites, error } = await supabase
    .from('favorites')
    .select('recipe_id')
    .limit(100); // get a sample to count from

  if (error || !topFavorites || topFavorites.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🌟</div>
        <h1 className="text-3xl font-bold text-stone-900 mb-3">
          Popular Recipes
        </h1>
        <p className="text-stone-500 mb-8">
          No favorites yet — be the first to save some recipes!
        </p>
        <Link
          href="/recipes"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          Browse Recipes
        </Link>
      </div>
    );
  }

  // ─── STEP 2: Count occurrences of each recipe_id ──────────────────────────
  // Count how many times each recipe was saved
  const countMap: Record<number, number> = {};
  topFavorites.forEach(({ recipe_id }) => {
    countMap[recipe_id] = (countMap[recipe_id] || 0) + 1;
  });

  // Sort by save count and take top 6
  const topIds = Object.entries(countMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([id, count]) => ({ id: Number(id), count }));

  // ─── STEP 3: Fetch full recipe details from Tasty ─────────────────────────
  // We fetch in parallel using Promise.allSettled so one failure
  // doesn't break the whole page
  const results = await Promise.allSettled(
    topIds.map(({ id }) => getRecipeById(id))
  );

  const recipes: { recipe: TastyRecipe; count: number }[] = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      recipes.push({
        recipe: result.value,
        count: topIds[i].count,
      });
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <div className="mb-10 text-center">
        <div className="text-5xl mb-3">🔥</div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Popular Recipes
        </h1>
        <p className="text-stone-500">
          The most saved recipes by our community
        </p>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(({ recipe, count }) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Image
                  src={recipe.thumbnail_url}
                  alt={recipe.thumbnail_alt_text || recipe.name}
                  width={556}
                  height={370}
                  className="w-full aspect-video object-cover"
                />
                {/* Save count badge */}
                <div className="absolute top-2 right-2 bg-white rounded-full px-2.5 py-1 text-xs font-medium text-stone-700 shadow">
                  🤍 {count} {count === 1 ? 'save' : 'saves'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 mb-1 line-clamp-2">
                  {recipe.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-stone-500">
                  {recipe.total_time_minutes && (
                    <span>⏱ {recipe.total_time_minutes} min</span>
                  )}
                  {recipe.num_servings && (
                    <span>🍽 {recipe.num_servings} servings</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-stone-400">
          <p className="text-lg mb-1">Not enough data yet</p>
          <p className="text-sm">Save some recipes and check back later!</p>
        </div>
      )}

    </div>
  );
}