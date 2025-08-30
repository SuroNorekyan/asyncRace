import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from '../components/NotFound';
import GaragePage from '../pages/GaragePage';
import WinnersPage from '../pages/WinnersPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/garage" replace />} />
    <Route path="/garage" element={<GaragePage />} />
    <Route path="/winners" element={<WinnersPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
