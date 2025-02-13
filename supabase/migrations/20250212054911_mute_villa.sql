/*
  # Add specialist information

  1. Changes
    - Add specialists column to diseases table
    - Update existing diseases with specialist information

  2. Security
    - Maintains existing RLS policies
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'diseases' AND column_name = 'specialists'
  ) THEN
    ALTER TABLE diseases 
    ADD COLUMN specialists jsonb[];
  END IF;
END $$;

-- Update existing diseases with specialist information
UPDATE diseases
SET specialists = array[
  '{"name": "Pulmonologist", "description": "Specializes in respiratory diseases", "contact": "+1-800-LUNG-DOC"}'::jsonb,
  '{"name": "Infectious Disease Specialist", "description": "Specializes in infectious diseases and their treatment", "contact": "+1-800-ID-DOCTOR"}'::jsonb
]
WHERE name = 'COVID-19';

UPDATE diseases
SET specialists = array[
  '{"name": "Primary Care Physician", "description": "General practitioner for common illnesses", "contact": "+1-800-DOC-CARE"}'::jsonb,
  '{"name": "ENT Specialist", "description": "Specializes in ear, nose, and throat conditions", "contact": "+1-800-ENT-SPEC"}'::jsonb
]
WHERE name = 'Common Cold';

UPDATE diseases
SET specialists = array[
  '{"name": "Primary Care Physician", "description": "General practitioner for flu treatment", "contact": "+1-800-FLU-CARE"}'::jsonb,
  '{"name": "Infectious Disease Specialist", "description": "For severe cases and complications", "contact": "+1-800-ID-DOCTOR"}'::jsonb
]
WHERE name = 'Influenza';

UPDATE diseases
SET specialists = array[
  '{"name": "Allergist", "description": "Specializes in allergies and immunology", "contact": "+1-800-ALLERGY"}'::jsonb,
  '{"name": "ENT Specialist", "description": "Treats chronic nasal conditions", "contact": "+1-800-ENT-SPEC"}'::jsonb
]
WHERE name = 'Allergic Rhinitis';

UPDATE diseases
SET specialists = array[
  '{"name": "Pulmonologist", "description": "Specializes in respiratory diseases", "contact": "+1-800-LUNG-DOC"}'::jsonb,
  '{"name": "Primary Care Physician", "description": "For initial diagnosis and treatment", "contact": "+1-800-DOC-CARE"}'::jsonb
]
WHERE name = 'Bronchitis';

UPDATE diseases
SET specialists = array[
  '{"name": "Pulmonologist", "description": "Lung specialist for pneumonia treatment", "contact": "+1-800-LUNG-DOC"}'::jsonb,
  '{"name": "Infectious Disease Specialist", "description": "For severe or resistant cases", "contact": "+1-800-ID-DOCTOR"}'::jsonb
]
WHERE name = 'Pneumonia';

UPDATE diseases
SET specialists = array[
  '{"name": "Rheumatologist", "description": "Specializes in arthritis and autoimmune conditions", "contact": "+1-800-RHEUMA"}'::jsonb,
  '{"name": "Physical Therapist", "description": "For rehabilitation and movement therapy", "contact": "+1-800-PT-REHAB"}'::jsonb
]
WHERE name = 'Rheumatoid Arthritis';

UPDATE diseases
SET specialists = array[
  '{"name": "Neurologist", "description": "Specializes in headaches and neurological conditions", "contact": "+1-800-NEURO"}'::jsonb,
  '{"name": "Pain Management Specialist", "description": "For chronic migraine management", "contact": "+1-800-PAIN-DOC"}'::jsonb
]
WHERE name = 'Migraine';

UPDATE diseases
SET specialists = array[
  '{"name": "Gastroenterologist", "description": "Digestive system specialist", "contact": "+1-800-GI-DOCTOR"}'::jsonb,
  '{"name": "Primary Care Physician", "description": "For initial diagnosis and treatment", "contact": "+1-800-DOC-CARE"}'::jsonb
]
WHERE name = 'Gastroesophageal Reflux Disease';

UPDATE diseases
SET specialists = array[
  '{"name": "Neurologist", "description": "Specializes in MS and nervous system disorders", "contact": "+1-800-NEURO"}'::jsonb,
  '{"name": "Physical Therapist", "description": "For mobility and rehabilitation", "contact": "+1-800-PT-REHAB"}'::jsonb,
  '{"name": "Occupational Therapist", "description": "For daily living adaptations", "contact": "+1-800-OT-HELP"}'::jsonb
]
WHERE name = 'Multiple Sclerosis';