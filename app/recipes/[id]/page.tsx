import { getRecipeById } from '@/lib/recipes-api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from '@/components/ui/FavoriteButton';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;

  let recipe = null;
  try {
    recipe = await getRecipeById(Number(id));
  } catch (e) {
    notFound();
  }

  if (!recipe) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      <Link
        href="/recipes"
        className="text-sm text-stone-500 hover:text-stone-800 mb-6 inline-block"
      >
        ← Back to recipes
      </Link>

      <Image
        src={recipe.image}
        alt={recipe.title}
        width={556}
        height={370}
        className="w-full rounded-2xl object-cover mb-6"
      />

      <h1 className="text-3xl font-bold text-stone-900 mb-2">{recipe.title}</h1>

      <div className="flex gap-4 text-sm text-stone-500 mb-4">
        <span>⏱ {recipe.readyInMinutes} min</span>
        <span>🍽 {recipe.servings} servings</span>
        {recipe.cuisines.length > 0 && (
          <span>🌍 {recipe.cuisines.join(', ')}</span>
        )}
      </div>

      {recipe.diets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {recipe.diets.map(diet => (
            <span
              key={diet}
              className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium capitalize"
            >
              {diet}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-6 mb-8">
        <FavoriteButton recipe={recipe} />
      </div>

      <div
        className="text-stone-600 leading-relaxed text-sm"
        dangerouslySetInnerHTML={{ __html: recipe.summary }}
      />

    </div>
  );
}