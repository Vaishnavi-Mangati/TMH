import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Disease, Symptom, Specialist } from '../types';

function DiseaseInfo() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchDiseases();
    fetchSymptoms();
  }, []);

  const fetchDiseases = async () => {
    const { data, error } = await supabase
      .from('diseases')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching diseases:', error);
      return;
    }
    
    setDiseases(data);
  };

  const fetchSymptoms = async () => {
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching symptoms:', error);
      return;
    }
    
    setSymptoms(data);
  };

  const getSymptomNames = (symptomIds: number[]) => {
    return symptoms
      .filter(symptom => symptomIds.includes(symptom.id))
      .map(symptom => symptom.name);
  };

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Disease Dropdown */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Disease</h2>
          
          <div className="relative">
            <div
              className="w-full flex items-center px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search diseases..."
                className="flex-1 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                <ul className="py-1">
                  {filteredDiseases.map((disease) => (
                    <li
                      key={disease.id}
                      onClick={() => {
                        setSelectedDisease(disease);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {disease.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disease Details */}
      <div className="lg:col-span-2">
        {selectedDisease ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedDisease.name}</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedDisease.description}</p>
              </div>

              {selectedDisease.severity && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Severity</h3>
                  <p className="text-gray-700">{selectedDisease.severity}</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {getSymptomNames(selectedDisease.symptoms).map((symptom) => (
                    <span
                      key={symptom}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              {selectedDisease.specialists && selectedDisease.specialists.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Specialists</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedDisease.specialists.map((specialist: Specialist, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">{specialist.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{specialist.description}</p>
                        <div className="flex items-center text-blue-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <a
                            href={`tel:${specialist.contact}`}
                            className="text-sm hover:text-blue-800"
                          >
                            {specialist.contact}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDisease.risk_factors && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Factors</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {selectedDisease.risk_factors.map((factor) => (
                      <li key={factor}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedDisease.common_age_groups && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Age Groups</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {selectedDisease.common_age_groups.map((group) => (
                      <li key={group}>{group}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedDisease.treatment_options && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Treatment Options</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {selectedDisease.treatment_options.map((treatment) => (
                      <li key={treatment}>{treatment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500">Select a disease to view detailed information</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiseaseInfo;