import Link from 'next/link';
import type { Metadata } from 'next';
import { TOPICS } from '@/lib/topics';

export const metadata: Metadata = {
  title: 'Browse by Topic',
  description: 'Explore recipes by topic — from easy dinners to meal prep.',
};

export default function TopicsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Browse by Topic
        </h1>
        <p className="text-stone-500">
          Find recipes that fit your lifestyle and schedule
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {TOPICS.map(topic => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-6 text-center"
          >
            <div className="text-4xl mb-3">{topic.emoji}</div>
            <h2 className="font-semibold text-stone-900 mb-1">
              {topic.label}
            </h2>
            <p className="text-xs text-stone-400 line-clamp-2">
              {topic.description}
            </p>
          </Link>
        ))}
      </div>

    </div>
  );
}