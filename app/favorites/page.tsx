import FavoritesList from '@/components/ui/FavoritesList';
import { supabase } from '@/lib/supabase';

export default async function FavoritesPage() {
  const { data: favorites, error } = await supabase
    .from('favorites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-red-500">
        Failed to load favorites. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900 mb-2">My Favorites</h1>
      <p className="text-stone-500 text-sm mb-8">
        {favorites.length} saved recipe{favorites.length !== 1 ? 's' : ''}
      </p>
      <FavoritesList initialFavorites={favorites} />
    </div>
  );
}