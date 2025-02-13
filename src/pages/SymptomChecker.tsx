import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Phone, MapPin, Navigation, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getUserLocation, calculateDistance, reverseGeocode } from '../lib/location';
import type { Disease, Symptom, Specialist, Location, Hospital } from '../types';

function SymptomChecker() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [isSymptomDropdownOpen, setIsSymptomDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Array<{
    disease: Disease;
    matchCount: number;
    totalSymptoms: number;
    confidence: number;
  }>>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchDiseases(), fetchSymptoms()]);
        await initializeLocation();
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Unable to load data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      calculatePredictions();
    } else {
      setPredictions([]);
    }
  }, [selectedSymptoms, userLocation]); // Recalculate when location changes

  const initializeLocation = async () => {
    try {
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude);
      setUserLocation({ latitude, longitude, address });
      setLocationError(null);
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message.includes('permission')
          ? (
            <>
              Location access was denied. <button
                onClick={handleRetryLocation}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Enable location
              </button> to see nearby specialists.
            </>
          )
          : 'Unable to get your location. Some features may be limited.';
        setLocationError(message);
      } else {
        setLocationError('Unable to get your location. Some features may be limited.');
      }
      console.error('Location error:', error);
    }
  };

  const handleRetryLocation = () => {
    localStorage.removeItem('locationPermission');
    initializeLocation();
  };

  const fetchDiseases = async () => {
    try {
      const { data, error } = await supabase
        .from('diseases')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setDiseases(data || []);
    } catch (error) {
      console.error('Error fetching diseases:', error);
      throw error;
    }
  };

  const fetchSymptoms = async () => {
    try {
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setSymptoms(data || []);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      throw error;
    }
  };

  const calculatePredictions = () => {
    const results = diseases
      .map(disease => {
        const matchCount = disease.symptoms.filter(id => selectedSymptoms.includes(id)).length;
        const totalSymptoms = disease.symptoms.length;
        const selectedSymptomCount = selectedSymptoms.length;
        
        const matchRatio = matchCount / totalSymptoms;
        const coverageRatio = matchCount / selectedSymptomCount;
        const confidence = (matchRatio + coverageRatio) / 2 * 100;

        // Add distance to specialists if user location is available
        const diseaseWithDistances = {
          ...disease,
          specialists: disease.specialists?.map(specialist => {
            if (userLocation && specialist.location) {
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                specialist.location.latitude,
                specialist.location.longitude
              );
              return { ...specialist, distance };
            }
            return specialist;
          }).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
        };

        return {
          disease: diseaseWithDistances,
          matchCount,
          totalSymptoms,
          confidence
        };
      })
      .filter(result => result.matchCount > 0)
      .sort((a, b) => b.confidence - a.confidence);

    setPredictions(results);
  };

  const getSymptomNames = (symptomIds: number[]) => {
    return symptoms
      .filter(symptom => symptomIds.includes(symptom.id))
      .map(symptom => symptom.name);
  };

  const filteredSymptoms = symptoms.filter(symptom => 
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSymptom = (symptomId: number) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-2xl">
          <div className="flex">
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-700 hover:text-red-600 underline"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {locationError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <div className="text-sm text-yellow-700">
                {locationError}
                {!userLocation && (
                  <button
                    onClick={handleRetryLocation}
                    className="ml-2 inline-flex items-center text-yellow-600 hover:text-yellow-800"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Retry Location Access
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {userLocation && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-400" />
            <p className="ml-3 text-sm text-blue-700">
              Your location: {userLocation.address}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Symptoms</h2>
        
        <div className="relative mb-6">
          <div
            className="w-full flex items-center px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            onClick={() => setIsSymptomDropdownOpen(!isSymptomDropdownOpen)}
          >
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search symptoms..."
              className="flex-1 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>

          {isSymptomDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {filteredSymptoms.map((symptom) => (
                  <li
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom.id)}
                      onChange={() => {}}
                      className="mr-3"
                    />
                    {symptom.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">Selected Symptoms:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(id => {
              const symptom = symptoms.find(s => s.id === id);
              return symptom ? (
                <span
                  key={symptom.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {symptom.name}
                  <button
                    onClick={() => toggleSymptom(symptom.id)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {predictions.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Possible Conditions</h2>
          <div className="space-y-6">
            {predictions.map(({ disease, matchCount, totalSymptoms, confidence }) => (
              <div key={disease.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{disease.name}</h3>
                    <p className="text-sm text-gray-500">
                      Matching {matchCount} out of {totalSymptoms} typical symptoms
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {Math.round(confidence)}% match
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{disease.description}</p>

                <div className="space-y-4">
                  {disease.severity && (
                    <div>
                      <h4 className="font-medium text-gray-900">Severity</h4>
                      <p className="text-gray-700">{disease.severity}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900">Common Symptoms</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getSymptomNames(disease.symptoms).map((symptom) => (
                        <span
                          key={symptom}
                          className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  {disease.specialists && disease.specialists.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Nearby Specialists</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {disease.specialists.map((specialist: Specialist, index) => (
                          <div
                            key={index}
                            className="p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <h5 className="font-medium text-gray-900 mb-1">{specialist.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{specialist.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-blue-600">
                                <Phone className="h-4 w-4 mr-2" />
                                <a
                                  href={`tel:${specialist.contact}`}
                                  className="text-sm hover:text-blue-800"
                                >
                                  {specialist.contact}
                                </a>
                              </div>
                              {specialist.distance !== undefined && (
                                <div className="flex items-center text-gray-500">
                                  <Navigation className="h-4 w-4 mr-1" />
                                  <span className="text-sm">{specialist.distance.toFixed(1)} km</span>
                                </div>
                              )}
                            </div>
                            {specialist.location?.address && (
                              <div className="mt-2 flex items-start text-gray-500">
                                <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                                <span className="text-sm">{specialist.location.address}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {disease.risk_factors && (
                    <div>
                      <h4 className="font-medium text-gray-900">Risk Factors</h4>
                      <ul className="list-disc pl-5 text-gray-700 mt-1">
                        {disease.risk_factors.map((factor) => (
                          <li key={factor}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This tool provides general information only and should not be used as a substitute for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SymptomChecker;