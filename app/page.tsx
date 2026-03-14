import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedRecipes } from '@/lib/recipes-api';
import { TastyRecipe } from '@/types';

export default async function HomePage() {
  let recipes: TastyRecipe[] = [];

  try {
    const data = await getFeaturedRecipes();
    recipes = data.results;
  } catch (e) {
    console.error('Failed to fetch featured recipes');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-stone-900 mb-3">
          Find Your Next Favourite Recipe
        </h1>
        <p className="text-stone-500 text-lg mb-6">
          Discover dishes by cuisine, ingredient, or dietary preference.
        </p>
        <Link
          href="/recipes"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          Browse Recipes
        </Link>
      </div>

      {/* Featured Recipes */}
      {recipes.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-stone-800 mb-4">
            Featured Recipes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={recipe.thumbnail_url}
                  alt={recipe.thumbnail_alt_text || recipe.name}
                  width={556}
                  height={370}
                  className="w-full aspect-video object-cover"
                />
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
                  {recipe.total_time_tier && (
                    <span className="mt-2 inline-block px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                      {recipe.total_time_tier.display_tier}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

    </div>
  );
}