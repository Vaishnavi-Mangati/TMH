/*
  # Initial Schema Setup for Disease Prediction System

  1. New Tables
    - Create symptoms and diseases tables if they don't exist
    - Add necessary columns and constraints
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (with existence check)
*/

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS symptoms (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diseases (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  symptoms integer[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'symptoms' AND policyname = 'Allow public read access for symptoms'
  ) THEN
    CREATE POLICY "Allow public read access for symptoms"
      ON symptoms
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'diseases' AND policyname = 'Allow public read access for diseases'
  ) THEN
    CREATE POLICY "Allow public read access for diseases"
      ON diseases
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;