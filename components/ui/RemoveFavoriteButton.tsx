'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  id: string;
  onRemove: (id: string) => void;
};

export default function RemoveFavoriteButton({ id, onRemove }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to remove. Please try again.');
      setLoading(false);
    } else {
      onRemove(id);
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // prevent the Link from triggering
        handleRemove();
      }}
      disabled={loading}
      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      {loading ? '...' : '✕'}
    </button>
  );
}