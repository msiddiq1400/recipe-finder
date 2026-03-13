-- Create favorites table
CREATE TABLE favorites (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id        INTEGER NOT NULL,
  title            TEXT NOT NULL,
  image            TEXT NOT NULL,
  ready_in_minutes INTEGER,
  servings         INTEGER,
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);