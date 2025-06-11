import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Simulate logged-in state for demonstration purposes
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("loggedIn") === "true";
        setLoggedIn(isAuthenticated);
    }, []);

    const isActive = (path) => {
        return location.pathname === path
            ? "text-black hover:text-blue-900"
            : "text-blue-900";
    };

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <nav className="h-[11vh] w-full bg-[#f8f8f8] text-black p-4 flex justify-around items-center shadow-md relative top-0 z-50">
            <div className="h-[11vh] w-7/8 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="Rally Point Logo"
                        className="h-10 w-10 inline-block mr-2"
                    />
                    <Link to="/">
                        <h1 className="text-xl font-bold px-2">Rally Point</h1>
                    </Link>
                </div>
                {/* Hamburger menu icon (mobile) */}
                <div className="md:hidden flex items-center">
                    <button
                        className="text-3xl text-blue-900 focus:outline-none hover:cursor-pointer"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
                {/* Nav links (desktop) */}
                <div className="hidden md:flex space-x-8 font-semibold items-center">
                    <Link to="/" className={isActive("/")}>
                        Home
                    </Link>
                    <Link to="/about" className={isActive("/about")}>
                        About
                    </Link>
                    <Link to="/events" className={isActive("/events")}>
                        Events
                    </Link>
                    <Link to="/rankings" className={isActive("/rankings")}>
                        Rankings
                    </Link>
                    <Link
                        className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-600 rounded-md transition-colors duration-300 ml-2"
                        to={loggedIn ? "/profile" : "/login"}
                    >
                        {loggedIn ? "Account" : "Login"}
                    </Link>
                </div>
            </div>
            {/* Mobile menu */}
            <div
                className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-full bg-[#f8f8f8] shadow-lg z-50 transform transition-transform duration-300 ${
                    menuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full p-6 space-y-6 font-semibold text-lg">
                    <div className="h-10">
                        
                    </div>
                    <Link
                        to="/"
                        className={isActive("/")}
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className={isActive("/about")}
                        onClick={() => setMenuOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        to="/events"
                        className={isActive("/events")}
                        onClick={() => setMenuOpen(false)}
                    >
                        Events
                    </Link>
                    <Link
                        to="/rankings"
                        className={isActive("/rankings")}
                        onClick={() => setMenuOpen(false)}
                    >
                        Rankings
                    </Link>
                    <Link
                        className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-600 rounded-md transition-colors duration-300 mt-2"
                        to={loggedIn ? "/profile" : "/login"}
                        onClick={() => setMenuOpen(false)}
                    >
                        {loggedIn ? "Account" : "Login"}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
