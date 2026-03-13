-- Add user_id column to favorites
ALTER TABLE favorites 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id required going forward
ALTER TABLE favorites 
ALTER COLUMN user_id SET NOT NULL;

-- Prevent duplicate saves per user
ALTER TABLE favorites
ADD CONSTRAINT unique_user_recipe UNIQUE (user_id, recipe_id);

-- Index for fast lookups by user
CREATE INDEX idx_favorites_user_id ON favorites (user_id);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can only see their own favorites
CREATE POLICY "Users can read own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);