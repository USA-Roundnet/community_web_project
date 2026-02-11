import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Check auth state on mount and route changes
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("loggedIn") === "true";
        setLoggedIn(isAuthenticated);
    }, [location.pathname]);

    const isActive = (path) => {
        return location.pathname === path
            ? "text-black hover:text-blue-900"
            : "text-blue-900";
    };

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("loggedIn");
        setLoggedIn(false);
        setMenuOpen(false);
        navigate("/");
    };

    return (
        <nav className="h-[11vh] w-full bg-[#f8f8f8] text-black p-4 flex justify-around items-center shadow-md relative top-0 z-50">
            <div className="h-[11vh] w-7/8 flex justify-between items-center">
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
                <div className="md:hidden flex items-center">
                    <button
                        className="text-3xl text-blue-900 focus:outline-none hover:cursor-pointer"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
                {/* Desktop nav */}
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
                    {loggedIn ? (
                        <div className="flex items-center space-x-3 ml-2">
                            <Link
                                className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-600 rounded-md transition-colors duration-300"
                                to="/profile"
                            >
                                Account
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-300 hover:cursor-pointer"
                                title="Log out"
                            >
                                <FiLogOut className="text-lg" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-600 rounded-md transition-colors duration-300 ml-2"
                            to="/login"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
            {/* Mobile side menu */}
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
                    {loggedIn ? (
                        <>
                            <Link
                                className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-600 rounded-md transition-colors duration-300 text-center mt-2"
                                to="/profile"
                                onClick={() => setMenuOpen(false)}
                            >
                                Account
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-md transition-colors duration-300 hover:cursor-pointer"
                            >
                                <FiLogOut />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <Link
                            className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-600 rounded-md transition-colors duration-300 mt-2"
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
