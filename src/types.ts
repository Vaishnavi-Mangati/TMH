export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Specialist {
  name: string;
  description: string;
  contact: string;
  location?: Location;
  distance?: number;
}

export interface Hospital {
  id: number;
  name: string;
  description: string;
  specialties: string[];
  location: Location;
  contact: string;
  emergency_contact?: string;
  distance?: number;
}

export interface Symptom {
  id: number;
  name: string;
}

export interface Disease {
  id: number;
  name: string;
  description: string;
  symptoms: number[];
  severity?: string;
  risk_factors?: string[];
  common_age_groups?: string[];
  treatment_options?: string[];
  specialists?: Specialist[];
}

export interface PredictionResult {
  disease: Disease;
  matchPercentage: number;
}