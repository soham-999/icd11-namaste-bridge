import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import ClinicalIntakePage from './pages/ClinicalIntake';
import TranslationConsolePage from './pages/Translation';
import SpecialistsPage from './pages/Specialists';
import InteroperabilityPage from './pages/Interoperability';
import PatientRegistryPage from './pages/PatientRegistry';
import PatientDetailPage from './pages/PatientDetail';
import AnalyticsPage from './pages/Analytics';
import AdminPage from './pages/Admin';
import SupportPage from './pages/Supports';
import LoginPage from './pages/Login';
import NotFoundPage from './pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/patients" element={<PatientRegistryPage />} />
      <Route path="/patients/:id" element={<PatientDetailPage />} />
      <Route path="/clinical/intake" element={<ClinicalIntakePage />} />
      <Route path="/translation" element={<TranslationConsolePage />} />
      <Route path="/specialists" element={<SpecialistsPage />} />
      <Route path="/interoperability" element={<InteroperabilityPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}