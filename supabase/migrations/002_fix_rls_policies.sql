-- Fix RLS policies: Add INSERT policy for users table
-- This allows users to create their own profile when they sign up

-- Drop existing policies if they exist (optional, for clean slate)
-- DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- Create INSERT policy for users
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- This policy allows a user to insert a row in the users table
-- only if the id matches their authenticated user ID (auth.uid())

