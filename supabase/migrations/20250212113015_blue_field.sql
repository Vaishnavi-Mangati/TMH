/*
  # Add location data to specialists

  1. Changes
    - Update specialists column to include location information
    - Add sample location data for existing specialists

  2. Security
    - Maintains existing RLS policies
*/

-- Update specialists with location information
UPDATE diseases
SET specialists = array[
  jsonb_build_object(
    'name', 'Pulmonologist',
    'description', 'Specializes in respiratory diseases',
    'contact', '+1-800-LUNG-DOC',
    'location', jsonb_build_object(
      'latitude', 40.7128,
      'longitude', -74.0060,
      'address', 'New York Presbyterian Hospital, 525 E 68th St, New York, NY 10065'
    )
  ),
  jsonb_build_object(
    'name', 'Infectious Disease Specialist',
    'description', 'Specializes in infectious diseases and their treatment',
    'contact', '+1-800-ID-DOCTOR',
    'location', jsonb_build_object(
      'latitude', 40.7589,
      'longitude', -73.9851,
      'address', 'Mount Sinai Hospital, 1468 Madison Ave, New York, NY 10029'
    )
  )
]::jsonb[]
WHERE name = 'COVID-19';

UPDATE diseases
SET specialists = array[
  jsonb_build_object(
    'name', 'Primary Care Physician',
    'description', 'General practitioner for common illnesses',
    'contact', '+1-800-DOC-CARE',
    'location', jsonb_build_object(
      'latitude', 40.7829,
      'longitude', -73.9654,
      'address', 'Lenox Hill Hospital, 100 E 77th St, New York, NY 10075'
    )
  ),
  jsonb_build_object(
    'name', 'ENT Specialist',
    'description', 'Specializes in ear, nose, and throat conditions',
    'contact', '+1-800-ENT-SPEC',
    'location', jsonb_build_object(
      'latitude', 40.7421,
      'longitude', -73.9864,
      'address', 'NYU Langone Medical Center, 550 1st Ave, New York, NY 10016'
    )
  )
]::jsonb[]
WHERE name IN ('Common Cold', 'Allergic Rhinitis');