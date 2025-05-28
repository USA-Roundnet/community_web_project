// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import CreateAccountPage from '../pages/CreateAccountPage';
import HomePage from '../pages/HomePage';
import TournamentsPage from '../pages/TournamentsPage';
import CreateTournamentBasicInfo from '../pages/CreateTournamentBasicInfo';
import CreateTournamentFormat from '../pages/CreateTournamentFormat';
import CreateTournamentRegistration from '../pages/CreateTournamentRegistration';
// import RankingsPage from '../pages/RankingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import EventsPage from '../pages/EventsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<CreateAccountPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/tournaments" element={<TournamentsPage />} />
      <Route path="/tournaments/create" element={<CreateTournamentBasicInfo />} />
      <Route path="/tournaments/create/format" element={<CreateTournamentFormat />} />
      <Route path="/tournaments/create/registration" element={<CreateTournamentRegistration />} />
      {/* <Route path="/rankings" element={<RankingsPage />} /> */}

      <Route path="/events" element={<EventsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;