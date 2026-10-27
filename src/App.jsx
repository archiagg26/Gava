import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PublicOnlyRoute from './components/PublicOnlyRoute';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import EligibilityChecker from './pages/EligibilityChecker';
import DocumentCenter from './pages/DocumentCenter';
import SchemeExplorer from './pages/SchemeExplorer';
import ApplicationTracker from './pages/ApplicationTracker';
import AIHelp from './pages/AIHelp';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#FAF7EE] text-stone-900 selection:bg-[#FFDCDC] selection:text-[#612f2f] font-sans antialiased">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/eligibility" element={<EligibilityChecker />} />
                  <Route path="/documents" element={<DocumentCenter />} />
                  <Route path="/schemes" element={<SchemeExplorer />} />
                  <Route path="/tracker" element={<ApplicationTracker />} />
                  <Route path="/ai-help" element={<AIHelp />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                  <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
