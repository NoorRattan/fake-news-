import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import HealthCheck from './components/HealthCheck';
import CustomCursor from './components/CustomCursor';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <HealthCheck />
      <CustomCursor />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.key}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
