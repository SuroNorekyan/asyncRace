import { Navigate, Route, Routes } from 'react-router-dom';
import GaragePage from '../pages/GaragePage';
import WinnersPage from '../pages/WinnersPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/garage" replace />} />
    <Route path="/garage" element={<GaragePage />} />
    <Route path="/winners" element={<WinnersPage />} />
  </Routes>
);

export default AppRoutes;
