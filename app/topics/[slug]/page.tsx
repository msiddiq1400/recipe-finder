import { TOPICS, TOPICS_BY_SLUG } from '@/lib/topics';
import { searchRecipesByTopic } from '@/lib/recipes-api';
import { TastyRecipe } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

// ─── generateStaticParams ─────────────────────────────────────────────────────
// Runs at BUILD TIME — tells Next.js to pre-build one page per topic slug.
// This is identical to what we did for cuisines — you're getting the pattern!
//
// Next.js will call this once and get back:
// [{ slug: 'dinner' }, { slug: 'breakfast' }, { slug: 'pasta' }, ...]
// Then pre-build 12 static HTML files — one per topic.
export async function generateStaticParams() {
  return TOPICS.map(topic => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = TOPICS_BY_SLUG[slug];
  if (!topic) return { title: 'Not Found' };

  return {
    title: `${topic.label} Recipes`,
    description: topic.description,
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const topic = TOPICS_BY_SLUG[slug];

  if (!topic) notFound();

  let recipes: TastyRecipe[] = [];
  try {
    const data = await searchRecipesByTopic(topic.slug);
    recipes = data.results;
  } catch (e) {
    console.error(`Failed to fetch ${topic.label} recipes`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Back */}
      <Link
        href="/topics"
        className="text-sm text-stone-500 hover:text-stone-800 mb-6 inline-block transition-colors"
      >
        ← All topics
      </Link>

      {/* Header */}
      <div className="mb-10 text-center">
        <div className="text-5xl mb-3">{topic.emoji}</div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          {topic.label} Recipes
        </h1>
        <p className="text-stone-500 max-w-md mx-auto">
          {topic.description}
        </p>
      </div>

      {/* Results */}
      {recipes.length > 0 ? (
        <>
          <p className="text-sm text-stone-400 mb-6">
            {recipes.length} recipes found
          </p>
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