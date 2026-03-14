import { getFeaturedRecipes } from '@/lib/recipes-api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from '@/components/ui/FavoriteButton';
import type { Metadata } from 'next';

// ─── ISR: DAILY REVALIDATION ──────────────────────────────────────────────────
// This page rebuilds once every 24 hours.
// - First visitor of the day gets a fresh build triggered in background
// - All subsequent visitors get the cached version instantly
// - No manual redeploy needed — Next.js handles it automatically
export const revalidate = 86400; // 24 hours in seconds

export const metadata: Metadata = {
  title: 'Recipe of the Day',
  description: 'A new featured recipe every day.',
};

export default async function RecipeOfTheDayPage() {
  let recipe = null;

  try {
    const data = await getFeaturedRecipes();

    if (!data.results || data.results.length === 0) notFound();

    // ── HOW WE PICK THE DAILY RECIPE ─────────────────────────────────────────
    // We use the current date as a seed to pick a recipe index.
    // Same date = same recipe for everyone, all day long.
    // Next day = different recipe automatically when page revalidates.
    const today = new Date();
    const seed = today.getFullYear() * 10000 +
                 (today.getMonth() + 1) * 100 +
                 today.getDate();
    const index = seed % data.results.length;
    recipe = data.results[index];
  } catch (e) {
    notFound();
  }

  if (!recipe) notFound();

  const totalRatings = recipe.user_ratings.count_positive + recipe.user_ratings.count_negative;
  const ratingPercent = Math.round(recipe.user_ratings.score * 100);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-orange-500 font-medium text-sm uppercase tracking-widest mb-2">
          Recipe of the Day
        </p>
        <p className="text-stone-400 text-sm">{today}</p>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
        <Image
          src={recipe.thumbnail_url}
          alt={recipe.thumbnail_alt_text || recipe.name}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Title & Meta */}
      <h1 className="text-3xl font-bold text-stone-900 mb-3">
        {recipe.name}
      </h1>

      {/* Quick stats */}
      <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-4">
        {recipe.total_time_minutes && (
          <span>⏱ {recipe.total_time_minutes} min</span>
        )}
        <span>🍽 {recipe.num_servings} servings</span>
        {recipe.total_time_tier && (
          <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
            {recipe.total_time_tier.display_tier}
          </span>
        )}
      </div>

      {/* Ratings */}
      {totalRatings > 0 && (
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
          <div className="flex-1 max-w-32 bg-stone-100 rounded-full h-2">
            <div
              className="bg-orange-400 h-2 rounded-full"
              style={{ width: `${ratingPercent}%` }}
            />
          </div>
          <span>{ratingPercent}% positive</span>
          <span>·</span>
          <span>{totalRatings.toLocaleString()} ratings</span>
        </div>
      )}

      {/* Description */}
      {recipe.description && (
        <div className="bg-stone-50 rounded-2xl p-6 mb-6">
          <p className="text-stone-600 leading-relaxed text-sm">
            {recipe.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/recipes/${recipe.id}`}
          className="btn flex-1 text-center bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          View Full Recipe →
        </Link>
        <FavoriteButton recipe={recipe} />
      </div>

      {/* ISR explanation for learning */}
      <div className="mt-10 p-4 rounded-xl border border-dashed border-stone-200 text-xs text-stone-400">
        <p>
          🔄 <strong>ISR in action:</strong> This page was statically generated
          and revalidates every 24 hours. The recipe changes daily without
          requiring a redeploy.
        </p>
      </div>

    </div>
  );
}