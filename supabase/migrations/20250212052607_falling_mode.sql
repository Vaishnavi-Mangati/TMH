/*
  # Add Detailed Disease Information

  1. Schema Updates
    - Add new columns to diseases table:
      - severity (text)
      - risk_factors (text array)
      - common_age_groups (text array)
      - treatment_options (text array)

  2. Data Updates
    - Add more comprehensive symptoms
    - Add detailed disease information
*/

-- Add new columns to diseases table for more detailed information
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'diseases' AND column_name = 'severity'
  ) THEN
    ALTER TABLE diseases 
    ADD COLUMN severity text,
    ADD COLUMN risk_factors text[],
    ADD COLUMN common_age_groups text[],
    ADD COLUMN treatment_options text[];
  END IF;
END $$;

-- Insert comprehensive symptoms list
INSERT INTO symptoms (name) VALUES
  -- Respiratory symptoms
  ('Wheezing'),
  ('Rapid breathing'),
  ('Chest tightness'),
  ('Shallow breathing'),
  ('Coughing up blood'),
  ('Nasal congestion'),
  ('Sinus pressure'),
  
  -- Digestive symptoms
  ('Abdominal pain'),
  ('Bloating'),
  ('Loss of appetite'),
  ('Difficulty swallowing'),
  ('Heartburn'),
  ('Vomiting'),
  ('Constipation'),
  
  -- Neurological symptoms
  ('Dizziness'),
  ('Memory problems'),
  ('Confusion'),
  ('Tremors'),
  ('Seizures'),
  ('Balance problems'),
  ('Speech difficulties'),
  
  -- Musculoskeletal symptoms
  ('Back pain'),
  ('Neck stiffness'),
  ('Muscle weakness'),
  ('Joint swelling'),
  ('Bone pain'),
  ('Limited range of motion'),
  
  -- Cardiovascular symptoms
  ('Heart palpitations'),
  ('Irregular heartbeat'),
  ('Leg swelling'),
  ('Cold extremities'),
  ('High blood pressure'),
  ('Chest pressure')
ON CONFLICT (name) DO NOTHING;

-- Insert detailed disease data
INSERT INTO diseases (
  name, 
  description, 
  symptoms, 
  severity,
  risk_factors,
  common_age_groups,
  treatment_options
) VALUES
  (
    'Pneumonia',
    'A serious infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm, fever, chills, and difficulty breathing.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Fever', 'Cough', 'Shortness of breath', 'Chest pain', 'Rapid breathing', 'Fatigue', 'Wheezing'
    )),
    'Moderate to Severe',
    ARRAY['Smoking', 'Weakened immune system', 'Recent respiratory infection', 'Chronic lung disease'],
    ARRAY['Elderly', 'Young children', 'Immunocompromised individuals'],
    ARRAY['Antibiotics', 'Rest', 'Hydration', 'Oxygen therapy']
  ),
  (
    'Rheumatoid Arthritis',
    'A chronic inflammatory disorder affecting many joints, including those in the hands and feet. The condition can damage various body systems, including the skin, eyes, lungs, heart and blood vessels.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Joint pain', 'Joint swelling', 'Fatigue', 'Fever', 'Muscle weakness', 'Limited range of motion', 'Morning stiffness'
    )),
    'Chronic',
    ARRAY['Genetic factors', 'Smoking', 'Obesity', 'Environmental exposures'],
    ARRAY['30-60 years old', 'More common in women'],
    ARRAY['DMARDs', 'NSAIDs', 'Physical therapy', 'Lifestyle modifications']
  ),
  (
    'Migraine',
    'A neurological condition that can cause multiple symptoms, most commonly characterized by intense, debilitating headaches. Symptoms may include nausea, vomiting, difficulty speaking, numbness or tingling, and sensitivity to light and sound.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Headache', 'Nausea', 'Dizziness', 'Vision problems', 'Sensitivity to light', 'Fatigue', 'Confusion'
    )),
    'Moderate',
    ARRAY['Hormonal changes', 'Stress', 'Certain foods', 'Environmental factors'],
    ARRAY['15-55 years old', 'More common in women'],
    ARRAY['Pain relief medication', 'Preventive medications', 'Lifestyle changes', 'Stress management']
  ),
  (
    'Gastroesophageal Reflux Disease',
    'A chronic digestive disease that occurs when stomach acid or bile flows back into the food pipe (esophagus), irritating the lining. This chronic digestive disease can lead to serious complications if left untreated.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Heartburn', 'Chest pain', 'Difficulty swallowing', 'Nausea', 'Regurgitation', 'Chronic cough', 'Sore throat'
    )),
    'Chronic',
    ARRAY['Obesity', 'Pregnancy', 'Smoking', 'Certain medications'],
    ARRAY['Adults of all ages', 'More common in older adults'],
    ARRAY['Antacids', 'H2 blockers', 'Proton pump inhibitors', 'Lifestyle modifications']
  ),
  (
    'Multiple Sclerosis',
    'A potentially disabling disease of the brain and spinal cord (central nervous system) in which the immune system attacks the protective sheath (myelin) that covers nerve fibers.',
    (SELECT ARRAY_AGG(id) FROM symptoms WHERE name IN (
      'Fatigue', 'Vision problems', 'Balance problems', 'Tremors', 'Memory problems', 'Speech difficulties', 'Muscle weakness'
    )),
    'Chronic Progressive',
    ARRAY['Genetic factors', 'Environmental factors', 'Vitamin D deficiency', 'Smoking'],
    ARRAY['20-40 years old', 'More common in women'],
    ARRAY['Disease-modifying therapies', 'Physical therapy', 'Occupational therapy', 'Medications for specific symptoms']
  )
ON CONFLICT (name) DO NOTHING;