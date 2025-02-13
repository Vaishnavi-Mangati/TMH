/*
  # Sample Medical Data Population

  1. Data Population
    - Symptoms: Common medical symptoms
    - Diseases: Common diseases with their associated symptoms and descriptions
  
  2. Notes
    - Each disease is linked to multiple symptoms via the symptoms array
    - Descriptions are simplified for demonstration purposes
*/

-- Insert sample symptoms
INSERT INTO symptoms (name) VALUES
  ('Fever'),
  ('Cough'),
  ('Fatigue'),
  ('Shortness of breath'),
  ('Headache'),
  ('Muscle pain'),
  ('Sore throat'),
  ('Loss of taste or smell'),
  ('Nausea'),
  ('Diarrhea'),
  ('Chest pain'),
  ('Runny nose'),
  ('Joint pain'),
  ('Rash'),
  ('Chills')
ON CONFLICT (name) DO NOTHING;

-- Insert sample diseases with their associated symptoms
INSERT INTO diseases (name, description, symptoms) VALUES
  (
    'COVID-19',
    'A respiratory illness caused by the SARS-CoV-2 virus. Symptoms typically appear 2-14 days after exposure.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Fever', 'Cough', 'Fatigue', 'Shortness of breath', 'Loss of taste or smell'
    ))
  ),
  (
    'Common Cold',
    'A viral infection of the upper respiratory tract. Usually mild and resolves within a week.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Runny nose', 'Sore throat', 'Cough', 'Fatigue', 'Headache'
    ))
  ),
  (
    'Influenza',
    'A viral infection that attacks your respiratory system. More severe than the common cold.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Fever', 'Cough', 'Fatigue', 'Muscle pain', 'Headache', 'Chills'
    ))
  ),
  (
    'Allergic Rhinitis',
    'An allergic response causing cold-like symptoms. Triggered by allergens like pollen or dust.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Runny nose', 'Sore throat', 'Headache', 'Fatigue'
    ))
  ),
  (
    'Bronchitis',
    'Inflammation of the bronchial tubes that carry air to and from your lungs.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Cough', 'Fatigue', 'Shortness of breath', 'Chest pain'
    ))
  )
ON CONFLICT (name) DO NOTHING;