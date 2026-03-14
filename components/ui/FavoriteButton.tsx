'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TastyRecipe } from '@/types';

type Props = {
  recipe: TastyRecipe;
};

export default function FavoriteButton({ recipe }: Props) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please login to save recipes.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      recipe_id: recipe.id,
      title: recipe.name,
      image: recipe.thumbnail_url,
      ready_in_minutes: recipe.total_time_minutes,
      servings: recipe.num_servings,
    });

    if (error) {
      alert('Failed to save. Please try again.');
    } else {
      setSaved(true);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleSave}
      disabled={saved || loading}
      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        saved
          ? 'bg-green-50 text-green-600 border border-green-200'
          : 'bg-orange-500 text-white hover:bg-orange-600'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? 'Saving...' : saved ? '✓ Saved!' : '🤍 Save Recipe'}
    </button>
  );
}