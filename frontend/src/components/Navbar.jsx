import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";

const Navbar = () => {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = React.useState(false);

    const isActive = (path) => {
        return location.pathname === path
            ? "text-blue-200 hover:text-white"
            : "text-white";
    };

    return (
        <nav className="w-full bg-blue-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <img src={logo} alt="Rally Point Logo" className="h-10 w-10 inline-block mr-2" />
                <h1 className="text-xl font-bold px-2">Rally Point</h1>
            </div>
            <div>
                <Link to="/" className={`px-4 ${isActive("/")}`}>
                    Home
                </Link>
                <Link to="/events" className={`px-4 ${isActive("/events")}`}>
                    Events
                </Link>
                <Link to="/tournaments" className={`px-4 ${isActive("/tournaments")}`}>
                    Tournaments
                </Link>
                <Link to="/rankings" className={`px-4 ${isActive("/rankings")}`}>
                    Rankings
                </Link>
                <button className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded">
                    <Link to={loggedIn ? "profile" : "login"}>{loggedIn ? "Account" : "Login"}</Link>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
