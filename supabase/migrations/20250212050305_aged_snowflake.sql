/*
  # Disease Prediction Database Schema

  1. New Tables
    - `symptoms`
      - `id` (serial, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
    
    - `diseases`
      - `id` (serial, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `symptoms` (integer array)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

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

ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for symptoms"
  ON symptoms
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for diseases"
  ON diseases
  FOR SELECT
  TO public
  USING (true);