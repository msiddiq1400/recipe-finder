import { Recipe } from '@/types';

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Classic Spaghetti Carbonara',
    image: 'https://img.spoonacular.com/recipes/654959-556x370.jpg',
    readyInMinutes: 25,
    servings: 4,
    cuisines: ['Italian'],
    diets: [],
    dishTypes: ['main course'],
    summary: 'A Roman classic — silky eggs and Pecorino Romano coat pasta strands with a rich, creamy sauce. No cream needed, just the magic of pasta water and technique.',
  },
  {
    id: 2,
    title: 'Thai Green Curry',
    image: 'https://img.spoonacular.com/recipes/664032-556x370.jpg',
    readyInMinutes: 35,
    servings: 4,
    cuisines: ['Thai'],
    diets: ['gluten free', 'dairy free'],
    dishTypes: ['main course'],
    summary: 'A fragrant coconut-milk based curry packed with vegetables. The green curry paste brings heat and complexity, while kaffir lime leaves add unmistakable aromatics.',
  },
  {
    id: 3,
    title: 'Avocado Toast with Poached Egg',
    image: 'https://img.spoonacular.com/recipes/637516-556x370.jpg',
    readyInMinutes: 15,
    servings: 2,
    cuisines: [],
    diets: ['vegetarian', 'dairy free'],
    dishTypes: ['breakfast'],
    summary: 'Creamy avocado on sourdough toast topped with a perfectly poached egg. Seasoned with flaky sea salt, red pepper flakes, and a squeeze of lemon.',
  },
  {
    id: 4,
    title: 'Beef Tacos with Mango Salsa',
    image: 'https://img.spoonacular.com/recipes/638420-556x370.jpg',
    readyInMinutes: 30,
    servings: 4,
    cuisines: ['Mexican'],
    diets: ['gluten free', 'dairy free'],
    dishTypes: ['main course'],
    summary: 'Seasoned ground beef in warm corn tortillas, topped with a bright mango salsa that brings sweetness and acidity to balance the spiced meat.',
  },
  {
    id: 5,
    title: 'Chocolate Lava Cake',
    image: 'https://img.spoonacular.com/recipes/641975-556x370.jpg',
    readyInMinutes: 20,
    servings: 4,
    cuisines: ['French'],
    diets: ['vegetarian'],
    dishTypes: ['dessert'],
    summary: 'Individual chocolate cakes with a warm molten center. Made with just 5 ingredients, this restaurant-quality dessert takes only 12 minutes to bake.',
  },
  {
    id: 6,
    title: 'Miso Soup with Tofu',
    image: 'https://img.spoonacular.com/recipes/660306-556x370.jpg',
    readyInMinutes: 10,
    servings: 2,
    cuisines: ['Japanese'],
    diets: ['vegetarian', 'vegan', 'gluten free'],
    dishTypes: ['soup'],
    summary: 'A comforting bowl of umami-rich miso broth with silken tofu and wakame seaweed. Never boil the miso — add it off heat to preserve its delicate flavor.',
  },
];

export const RECIPES_BY_ID = Object.fromEntries(
  SAMPLE_RECIPES.map(recipe => [recipe.id, recipe])
);