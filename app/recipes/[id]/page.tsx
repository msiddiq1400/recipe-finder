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

  // Extract cuisine tags
  const cuisines = recipe.tags
    .filter(t => t.root_tag_type === 'cuisine')
    .map(t => t.display_name);

  // Extract difficulty tags
  const difficulty = recipe.tags
    .find(t => t.root_tag_type === 'difficulty');

  // Calculate rating percentage
  const totalRatings = recipe.user_ratings.count_positive + recipe.user_ratings.count_negative;
  const ratingPercent = Math.round(recipe.user_ratings.score * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Back */}
      <Link
        href="/recipes"
        className="text-sm text-stone-500 hover:text-stone-800 mb-6 inline-block transition-colors"
      >
        ← Back to recipes
      </Link>

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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-900 mb-3">
          {recipe.name}
        </h1>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-4">
          {recipe.total_time_minutes && (
            <span>⏱ {recipe.total_time_minutes} min total</span>
          )}
          {recipe.prep_time_minutes && (
            <span>🔪 {recipe.prep_time_minutes} min prep</span>
          )}
          {recipe.cook_time_minutes && (
            <span>🍳 {recipe.cook_time_minutes} min cook</span>
          )}
          <span>🍽 {recipe.num_servings} servings</span>
          {difficulty && (
            <span>📊 {difficulty.display_name}</span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {cuisines.map(c => (
            <span
              key={c}
              className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium"
            >
              {c}
            </span>
          ))}
          {recipe.total_time_tier && (
            <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
              {recipe.total_time_tier.display_tier}
            </span>
          )}
        </div>

        {/* Ratings */}
        {totalRatings > 0 && (
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
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

        {/* Save Button */}
        <FavoriteButton recipe={recipe} />
      </div>

      {/* Description */}
      {recipe.description && (
        <div className="bg-stone-50 rounded-2xl p-6 mb-8">
          <p className="text-stone-600 leading-relaxed text-sm">
            {recipe.description}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-8">

        {/* Ingredients */}
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-4">
            Ingredients
          </h2>
          {recipe.sections.map((section, i) => (
            <div key={i} className="mb-4">
              {section.name && (
                <h3 className="font-medium text-stone-700 mb-2">
                  {section.name}
                </h3>
              )}
              <ul className="space-y-2">
                {section.components.map(component => {
                  // Prefer imperial measurements
                  const measurement = component.measurements.find(
                    m => m.unit.system === 'imperial'
                  ) || component.measurements[0];

                  return (
                    <li
                      key={component.id}
                      className="flex items-start gap-2 text-sm text-stone-600"
                    >
                      <span className="text-orange-400 mt-0.5">•</span>
                      <span>
                        {measurement && measurement.quantity !== '0' && (
                          <span className="font-medium">
                            {measurement.quantity} {measurement.unit.abbreviation}{' '}
                          </span>
                        )}
                        {component.ingredient.display_singular}
                        {component.extra_comment && (
                          <span className="text-stone-400">
                            , {component.extra_comment}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Nutrition */}
        {recipe.nutrition && (
          <div>
            <h2 className="text-xl font-bold text-stone-900 mb-4">
              Nutrition
              <span className="text-sm font-normal text-stone-400 ml-2">
                per serving
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal' },
                { label: 'Protein', value: recipe.nutrition.protein, unit: 'g' },
                { label: 'Carbs', value: recipe.nutrition.carbohydrates, unit: 'g' },
                { label: 'Fat', value: recipe.nutrition.fat, unit: 'g' },
                { label: 'Fiber', value: recipe.nutrition.fiber, unit: 'g' },
                { label: 'Sugar', value: recipe.nutrition.sugar, unit: 'g' },
              ].map(({ label, value, unit }) => (
                <div
                  key={label}
                  className="bg-stone-50 rounded-xl p-3 text-center"
                >
                  <p className="text-lg font-bold text-stone-900">
                    {value}
                    <span className="text-xs font-normal text-stone-400 ml-1">
                      {unit}
                    </span>
                  </p>
                  <p className="text-xs text-stone-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-stone-900 mb-4">
          Instructions
        </h2>
        <ol className="space-y-4">
          {recipe.instructions.map(step => (
            <li key={step.id} className="flex gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
                {step.position}
              </span>
              <div className="pt-0.5">
                <p className="text-stone-600 text-sm leading-relaxed">
                  {step.display_text}
                </p>
                {step.temperature && (
                  <p className="text-xs text-stone-400 mt-1">
                    🌡 {step.temperature}°F
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Tips */}
      {recipe.tips_summary && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-3">
            💡 {recipe.tips_summary.header}
          </h2>
          <div className="space-y-1">
            {recipe.tips_summary.content.split('\n').map((tip, i) => (
              <p key={i} className="text-sm text-stone-600">
                {tip}
              </p>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}