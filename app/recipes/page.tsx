import { SAMPLE_RECIPES } from '@/lib/sample-data';
import { searchRecipes } from '@/lib/recipes-api';
import Image from 'next/image';
import Link from 'next/link';
import { SearchResult } from '@/types';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function RecipesPage({ searchParams }: Props) {
  const { q } = await searchParams;

  // If there's a search query, fetch from Spoonacular (SSR)
  // Otherwise, fall back to sample data (SSG)
  let recipes: SearchResult[] = [];
  let error = null;

  if (q) {
    try {
      const data = await searchRecipes(q);
      recipes = data.results;
    } catch (e) {
      error = 'Something went wrong. Please try again.';
    }
  } else {
    recipes = SAMPLE_RECIPES;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold text-stone-900 mb-6">Browse Recipes</h1>

      {/* Search */}
      <form method="GET" className="mb-8">
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name, cuisine, diet..."
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
          {recipes.map((recipe: SearchResult) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={recipe.image}
                alt={recipe.title}
                width={556}
                height={370}
                className="w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 mb-1">{recipe.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !error && (
          <div className="text-center py-16 text-stone-400">
            <p className="text-lg mb-1">No recipes found</p>
            <p className="text-sm">{"Try searching for 'pasta' or 'chicken'"}</p>
          </div>
        )
      )}

    </div>
  );
}