import Link from 'next/link';
import { SAMPLE_RECIPES } from '@/lib/sample-data';
import Image from 'next/image';

export default function HomePage() {
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

      {/* Recipe Grid */}
      <h2 className="text-xl font-semibold text-stone-800 mb-4">Featured Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_RECIPES.map(recipe => (
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
              <p className="text-sm text-stone-500">{recipe.readyInMinutes} min · {recipe.servings} servings</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}