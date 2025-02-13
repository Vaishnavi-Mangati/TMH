import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import SymptomChecker from './pages/SymptomChecker';
import DiseaseInfo from './pages/DiseaseInfo';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Disease Information System</h1>
              </div>
              <nav className="flex space-x-4">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Symptom Checker
                </Link>
                <Link
                  to="/diseases"
                  className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Disease Database
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<SymptomChecker />} />
            <Route path="/diseases" element={<DiseaseInfo />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;