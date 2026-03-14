import Link from 'next/link';
import { CUISINES } from '@/lib/cuisines';
import type { Metadata } from 'next';

// ─── SSG ──────────────────────────────────────────────────────────────────────
// This page is fully static — it just renders the CUISINES list which is
// hardcoded. Next.js pre-builds this at build time, no API calls needed.

export const metadata: Metadata = {
  title: 'Browse by Cuisine',
  description: 'Explore recipes from cuisines around the world.',
};

export default function CuisinesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Browse by Cuisine
        </h1>
        <p className="text-stone-500">
          Explore recipes from around the world
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CUISINES.map(cuisine => (
          <Link
            key={cuisine.slug}
            href={`/cuisines/${cuisine.slug}`}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-6 text-center"
          >
            <div className="text-4xl mb-3">{cuisine.emoji}</div>
            <h2 className="font-semibold text-stone-900 mb-1">
              {cuisine.label}
            </h2>
            <p className="text-xs text-stone-400 line-clamp-2">
              {cuisine.description}
            </p>
          </Link>
        ))}
      </div>

    </div>
  );
}