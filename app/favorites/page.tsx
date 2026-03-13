import { createSupabaseServer } from '@/lib/supabase-server';
import FavoritesList from '@/components/ui/FavoritesList';
import Link from 'next/link';

export default async function FavoritesPage() {
  const supabase = await createSupabaseServer();

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-stone-900 mb-3">
          Login to see your favorites
        </h1>
        <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto">
          Create a free account to save recipes and access them from anywhere.
        </p>
        <Link
          href="/auth"
          className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          Login / Sign up
        </Link>
      </div>
    );
  }

  // Fetch only this user's favorites
  const { data: favorites, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
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