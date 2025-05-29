// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import CreateAccountPage from "../pages/CreateAccountPage";
import HomePage from "../pages/HomePage";
import TournamentsPage from "../pages/TournamentsPage";
import CreateTournamentBasicInfo from "../pages/CreateTournamentBasicInfo";
import CreateTournamentFormat from "../pages/CreateTournamentFormat";
import CreateTournamentRegistration from "../pages/CreateTournamentRegistration";
// import RankingsPage from '../pages/RankingsPage';
import NotFoundPage from "../pages/NotFoundPage";
import EventsPage from "../pages/EventsPage";
import Layout from "../components/Outlet";

const AppRoutes = () => {
    return (
         <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/tournaments" element={<TournamentsPage />} />
                <Route path="/tournaments/create" element={<CreateTournamentBasicInfo />} />
                <Route path="/tournaments/create/format" element={<CreateTournamentFormat />} />
                <Route path="/tournaments/create/registration" element={<CreateTournamentRegistration />} />
                <Route path="/events" element={<EventsPage />} />
            </Route>

            {/* Routes that DO NOT use the layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<CreateAccountPage />} />
            <Route path="/forgot" element={<LoginPage />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
