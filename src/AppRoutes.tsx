import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing/';
import App from './App';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<App />} />
      
      {/* Redirection de /editor vers /app */}
      <Route path="/editor" element={<Navigate to="/app" replace />} />
      
      {/* Optionnel : redirection 404 vers l'accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}