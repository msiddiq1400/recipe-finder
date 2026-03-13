export default function FavoritesLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="h-9 w-48 bg-stone-200 rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-24 bg-stone-200 rounded animate-pulse mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-100">
            <div className="aspect-video bg-stone-200 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-stone-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-stone-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}