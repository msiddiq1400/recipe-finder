import { CUISINES, CUISINES_BY_SLUG } from '@/lib/cuisines';
import { searchRecipesByCuisine } from '@/lib/recipes-api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { TastyRecipe } from '@/types';

type Props = {
  params: Promise<{ slug: string }>;
};

// ─── STEP 1: TELL NEXT.JS WHICH PAGES TO PRE-BUILD ───────────────────────────
// This runs at BUILD TIME only.
// Next.js calls this function to get the list of all slugs,
// then pre-builds one HTML page for each one.
//
// Output: [
//   { slug: 'italian' },
//   { slug: 'mexican' },
//   { slug: 'chinese' },
//   ...
// ]
export async function generateStaticParams() {
  return CUISINES.map(cuisine => ({
    slug: cuisine.slug,
  }));
}

// ─── STEP 2: GENERATE METADATA PER PAGE ──────────────────────────────────────
// Also runs at build time. Each cuisine gets its own <title> and description.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cuisine = CUISINES_BY_SLUG[slug];
  if (!cuisine) return { title: 'Not Found' };

  return {
    title: `${cuisine.label} Recipes`,
    description: cuisine.description,
  };
}

// ─── STEP 3: THE PAGE COMPONENT ──────────────────────────────────────────────
// Also runs at build time for each slug.
// At build time Next.js calls this 8 times (once per cuisine),
// generating 8 static HTML files.
export default async function CuisineDetailPage({ params }: Props) {
  const { slug } = await params;
  const cuisine = CUISINES_BY_SLUG[slug];

  // If someone visits /cuisines/something-invalid → 404
  if (!cuisine) notFound();

  let recipes: TastyRecipe[] = [];
  try {
    const data = await searchRecipesByCuisine(cuisine.label);
    recipes = data.results;
  } catch (e) {
    console.error(`Failed to fetch ${cuisine.label} recipes`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Back */}
      <Link
        href="/cuisines"
        className="text-sm text-stone-500 hover:text-stone-800 mb-6 inline-block transition-colors"
      >
        ← All cuisines
      </Link>

      {/* Header */}
      <div className="mb-10 text-center">
        <div className="text-5xl mb-3">{cuisine.emoji}</div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          {cuisine.label} Recipes
        </h1>
        <p className="text-stone-500 max-w-md mx-auto">
          {cuisine.description}
        </p>
      </div>

      {/* ── SSG EXPLANATION ────────────────────────────────────────────────────
        Everything above this comment was generated at BUILD TIME.
        The HTML for this page was created once and saved to disk.
        Every user who visits /cuisines/italian gets the same
        pre-built HTML file — no server processing, no API calls at runtime.

        Compare this to /recipes?q=italian which is SSR —
        it fetches fresh data on EVERY request.

        SSG is faster. SSR is fresher. Choose based on your needs.
      */}

      {/* Results */}
      {recipes.length > 0 ? (
        <>
          <p className="text-sm text-stone-400 mb-6">
            {recipes.length} recipes found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe: TastyRecipe) => (
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
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-stone-400">
          <p className="text-lg mb-1">No recipes found</p>
          <p className="text-sm">Try browsing all recipes instead</p>
          <Link
            href="/recipes"
            className="mt-4 inline-block bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Browse All
          </Link>
        </div>
      )}

    </div>
  );
}