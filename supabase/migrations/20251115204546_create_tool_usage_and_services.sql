/*
  # Complete Database Schema for Nova Developer Tools

  ## Overview
  This migration sets up the complete database schema for the Nova application,
  including user profiles, tool usage tracking, user preferences, and sessions.

  ## New Tables
  
  1. `tool_usage`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `tool_id` (text) - identifier for the tool used
    - `tool_name` (text) - human-readable tool name
    - `used_at` (timestamptz) - when the tool was used
    - `metadata` (jsonb) - additional data about usage
    
  2. `user_preferences`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `theme` (text) - light/dark theme preference
    - `default_tool` (text) - default tool to show
    - `settings` (jsonb) - other user settings
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
    
  3. `user_sessions`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users)
    - `started_at` (timestamptz)
    - `ended_at` (timestamptz)
    - `tools_used` (jsonb) - array of tools used in session

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Policies for SELECT, INSERT, UPDATE, DELETE operations
  
  ## Functions & Triggers
  - Auto-update `updated_at` timestamps
  - Auto-create user profile on signup
*/

-- Create tool_usage table
CREATE TABLE IF NOT EXISTS tool_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_id text NOT NULL,
  tool_name text NOT NULL,
  used_at timestamptz DEFAULT now() NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON tool_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_id ON tool_usage(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_used_at ON tool_usage(used_at DESC);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme text DEFAULT 'light',
  default_tool text,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for user_preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at timestamptz DEFAULT now() NOT NULL,
  ended_at timestamptz,
  tools_used jsonb DEFAULT '[]'::jsonb,
  session_duration interval,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at DESC);

-- Enable Row Level Security
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tool_usage
CREATE POLICY "Users can view own tool usage"
  ON tool_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tool usage"
  ON tool_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tool usage"
  ON tool_usage
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_preferences updated_at
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now())
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_preferences (user_id, created_at, updated_at)
  VALUES (NEW.id, now(), now())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to track tool usage
CREATE OR REPLACE FUNCTION track_tool_usage(
  p_tool_id text,
  p_tool_name text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
  v_usage_id uuid;
BEGIN
  INSERT INTO tool_usage (user_id, tool_id, tool_name, metadata)
  VALUES (auth.uid(), p_tool_id, p_tool_name, p_metadata)
  RETURNING id INTO v_usage_id;
  
  RETURN v_usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats()
RETURNS TABLE (
  total_tools_used bigint,
  favorite_tool text,
  total_sessions bigint,
  last_used timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT tool_id)::bigint as total_tools_used,
    (
      SELECT tool_name
      FROM tool_usage
      WHERE user_id = auth.uid()
      GROUP BY tool_name
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as favorite_tool,
    (
      SELECT COUNT(*)::bigint
      FROM user_sessions
      WHERE user_id = auth.uid()
    ) as total_sessions,
    (
      SELECT MAX(used_at)
      FROM tool_usage
      WHERE user_id = auth.uid()
    ) as last_used
  FROM tool_usage
  WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
