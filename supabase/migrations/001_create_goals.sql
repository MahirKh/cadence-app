-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('career', 'fitness', 'finance', 'personal_dev')),
  timeframe TEXT NOT NULL CHECK (timeframe IN ('yearly', 'quarterly', 'monthly', 'weekly')),
  target_date DATE,
  success_criteria TEXT,
  parent_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_parent_goal_id ON goals(parent_goal_id);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own goals
CREATE POLICY "Users can view own goals"
  ON goals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own goals
CREATE POLICY "Users can create own goals"
  ON goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own goals
CREATE POLICY "Users can update own goals"
  ON goals
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own goals
CREATE POLICY "Users can delete own goals"
  ON goals
  FOR DELETE
  USING (auth.uid() = user_id);
