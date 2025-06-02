// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import HomePage from "../pages/HomePage";
import TournamentsPage from "../pages/TournamentsPage";
import CreateTournamentBasicInfo from "../pages/CreateTournamentBasicInfo";
import CreateTournamentFormat from "../pages/CreateTournamentFormat";
import CreateTournamentRegistration from "../pages/CreateTournamentRegistration";
// import RankingsPage from '../pages/RankingsPage';
import NotFoundPage from "../pages/NotFoundPage";
import EventsPage from "../pages/EventsPage";
import Layout from "../components/Outlet";
import ForgotPage from "../pages/ForgotPage";

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
                <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/forgot" element={<ForgotPage />} />
        

            
        </Routes>
    );
};

export default AppRoutes;
