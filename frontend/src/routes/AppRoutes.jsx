// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import CreateAccountPage from '../pages/CreateAccountPage';
import HomePage from '../pages/HomePage';
// import TournamentsPage from '../pages/TournamentsPage';
// import CreateTournamentPage from '../pages/CreateTournamentPage';
// import RankingsPage from '../pages/RankingsPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/home" element={<HomePage />} />
      {/* <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/tournaments/create" element={<CreateTournamentPage />} />
      <Route path="/rankings" element={<RankingsPage />} /> */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;