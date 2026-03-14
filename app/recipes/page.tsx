import { getFeaturedRecipes, searchRecipes } from '@/lib/recipes-api';
import { TastyRecipe } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function RecipesPage({ searchParams }: Props) {
  const { q } = await searchParams;

  let recipes: TastyRecipe[] = [];
  let error = null;

  try {
    if (q) {
      const data = await searchRecipes(q);
      recipes = data.results;
    } else {
      const data = await getFeaturedRecipes();
      recipes = data.results;
    }
  } catch (e) {
    error = 'Something went wrong. Please try again.';
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold text-stone-900 mb-6">
        {q ? `Results for "${q}"` : 'Browse Recipes'}
      </h1>

      {/* Search */}
      <form method="GET" className="mb-8">
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name, cuisine, ingredient..."
            className="flex-1 px-4 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:border-orange-400"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-stone-400 mb-4">
        {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
        {q && ` for "${q}"`}
      </p>

      {/* Grid */}
      {recipes.length > 0 ? (
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
      ) : (
        !error && (
          <div className="text-center py-16 text-stone-400">
            <p className="text-lg mb-1">No recipes found</p>
            <p className="text-sm">{'Try searching for "pasta" or "chicken"'}</p>
          </div>
        )
      )}

    </div>
  );
}