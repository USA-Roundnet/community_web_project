// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import HomePage from "../pages/HomePage";
import TournamentsPage from "../pages/TournamentsPage";
import CreateTournamentBasicInfo from "../pages/CreateTournamentBasicInfo";
import CreateTournamentFormat from "../pages/CreateTournamentFormat";
import CreateTournamentRegistration from "../pages/CreateTournamentRegistration";
import TournamentManagementPage from "../pages/TournamentManagementPage";
import EditTournamentPage from "../pages/EditTournamentPage";
import TournamentSchedulePage from "../pages/TournamentSchedulePage";
import TournamentEventPage from "../pages/TournamentEventPage";
// import RankingsPage from '../pages/RankingsPage';
import NotFoundPage from "../pages/NotFoundPage";
import AboutPage from "../pages/AboutPage";
import ProfilePage from "../pages/ProfilePage";
import Layout from "../components/Outlet";
import ForgotPage from "../pages/ForgotPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

const AppRoutes = () => {
    return (
         <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<TournamentsPage />} />
                <Route path="/events/create" element={<CreateTournamentBasicInfo />} />
                <Route path="/events/create/format" element={<CreateTournamentFormat />} />
                <Route path="/events/create/registration" element={<CreateTournamentRegistration />} />
                <Route path="/events/:id" element={<TournamentEventPage />} />
                <Route path="/events/:id/manage" element={<TournamentManagementPage />} />
                <Route path="/events/:id/edit" element={<EditTournamentPage />} />
                <Route path="/events/:id/schedule" element={<TournamentSchedulePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/forgot" element={<ForgotPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
