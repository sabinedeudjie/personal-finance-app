import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import { ThemeProvider } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';

import AppLayout from './components/Layout/AppLayout';
import Onboarding from './components/Onboarding/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';

import { useAuth } from './hooks/useAuth';

/**
 * PROTECTION DES ROUTES DU DASHBOARD
 * C'est ici qu'on force l'utilisateur à sortir s'il n'est pas connecté.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  if (!isAuthenticated) {
    // Si pas connecté, on dépanne vers login, et on vide le dashboard du rendu
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // On force la lecture du localStorage
    const seen = localStorage.getItem('hasSeenOnboarding') === 'true';
    setHasSeenOnboarding(seen);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
  };

  // Tant qu'on charge l'auth ou l'onboarding, on ne montre rien d'autre
  if (loading || hasSeenOnboarding === null) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  // LOGIQUE 1 : ONBOARDING PRIORITAIRE
  // Si l'utilisateur n'a pas vu l'onboarding, peu importe l'URL, on l'envoie sur /onboarding
  if (!hasSeenOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <FinanceProvider>
      <Routes>
        {/* Route Onboarding */}
        <Route
          path="/onboarding"
          element={!hasSeenOnboarding ? <Onboarding onComplete={completeOnboarding} /> : <Navigate to="/login" replace />}
        />

        {/* Routes Connexion / Inscription */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />}
        />

        {/* LOGIQUE 2 : ROUTES SÉCURISÉES */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Redirection automatique pour toute autre URL */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </FinanceProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
