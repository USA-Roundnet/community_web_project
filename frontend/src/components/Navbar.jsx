import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";

const Navbar = () => {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = React.useState(false);

    // Simulate logged-in state for demonstration purposes
    React.useEffect(() => {
        // Here you would typically check the authentication state
        // For this example, we'll just toggle loggedIn state
        const isAuthenticated = localStorage.getItem("loggedIn") === "true";
        setLoggedIn(isAuthenticated);
    }, []);

    const isActive = (path) => {
        return location.pathname === path
            ? "text-black hover:text-blue-900"
            : "text-blue-900";
    };

    return (
        <nav className="h-[11vh] w-full bg-[#f8f8f8] text-black p-4 flex justify-around items-center">
            <div className="h-[11vh] w-7/8 flex justify-between items-center border-b-3 border-blue-900">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="Rally Point Logo"
                            className="h-10 w-10 inline-block mr-2"
                        />
                        <Link to="/">
                            <h1 className="text-xl font-bold px-2">
                                Rally Point
                            </h1>
                        </Link>
                    </div>

                    <div className="flex space-x-8 ml-8 font-semibold">
                        <Link to="/" className={`${isActive("/")}`}>
                            Home
                        </Link>
                        <Link
                            to="/events"
                            className={`${isActive("/events")}`}
                        >
                            Events
                        </Link>
                        <Link
                            to="/tournaments"
                            className={`${isActive("/tournaments")}`}
                        >
                            Tournaments
                        </Link>
                        <Link
                            to="/rankings"
                            className={`${isActive("/rankings")}`}
                        >
                            Rankings
                        </Link>
                    </div>
                </div>
                <div className="flex items-center">
                    <Link to={loggedIn ? "profile" : "login"}>
                        <button className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-600 rounded-md transition-colors duration-300">
                            {loggedIn ? "Account" : "Login"}
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
