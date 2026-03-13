'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RemoveFavoriteButton from './RemoveFavoriteButton';

type Favorite = {
  id: string;
  recipe_id: number;
  title: string;
  image: string;
  ready_in_minutes: number;
  servings: number;
};

type Props = {
  initialFavorites: Favorite[];
};

export default function FavoritesList({ initialFavorites }: Props) {
  const [favorites, setFavorites] = useState(initialFavorites);

  function handleRemove(id: string) {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16 text-stone-400">
        <div className="text-5xl mb-4">🤍</div>
        <p className="text-lg mb-1">No saved recipes yet</p>
        <p className="text-sm mb-6">Hit the Save button on any recipe to add it here</p>
        <Link
          href="/recipes"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          Browse Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {favorites.map(fav => (
        <div key={fav.id} className="relative">
          <RemoveFavoriteButton id={fav.id} onRemove={handleRemove} />
          <Link
            href={`/recipes/${fav.recipe_id}`}
            className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow block"
          >
            <Image
              src={fav.image}
              alt={fav.title}
              width={556}
              height={370}
              className="w-full object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-stone-900 mb-1">{fav.title}</h3>
              <p className="text-sm text-stone-500">
                {fav.ready_in_minutes && `⏱ ${fav.ready_in_minutes} min`}
                {fav.servings && ` · 🍽 ${fav.servings} servings`}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}