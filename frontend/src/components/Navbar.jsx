import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/rallypoint-logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/rankings", label: "Rankings" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("authToken")));
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("tournamentBasicInfo");
    localStorage.removeItem("tournamentFormat");
    localStorage.removeItem("tournamentRegistration");
    setLoggedIn(false);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "text-[var(--op-primary-strong)]"
      : "text-[var(--op-secondary)] hover:text-[var(--op-primary)]";

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--op-border)] bg-white/95 backdrop-blur">
      <div className="max-w-[1220px] mx-auto px-3 sm:px-4 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Rally Point" className="h-9 w-9" />
          <Link to="/" className="op-display text-lg sm:text-xl font-bold text-[var(--op-primary-strong)]">
            Rally Point
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden text-2xl text-[var(--op-secondary)]"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className="hidden md:flex items-center gap-6 op-ui font-semibold text-sm">
          {navLinks.map((item) => (
            <Link key={item.to} to={item.to} className={linkClass(item.to)}>
              {item.label}
            </Link>
          ))}

          {loggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-600 rounded-md transition-colors duration-300"
              >
                Account
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-300 hover:cursor-pointer"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="op-btn px-4 py-2 bg-[var(--op-primary)] text-white hover:bg-[var(--op-primary-strong)]"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {menuOpen ? (
        <div className="md:hidden border-t border-[var(--op-border)] bg-white p-3">
          <div className="flex flex-col gap-2 op-ui font-semibold text-sm">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-2 rounded-lg ${linkClass(item.to)}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {loggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="hover:cursor-pointer px-4 py-2 text-[#f8f8f8] bg-blue-900 hover:bg-blue-600 rounded-md transition-colors duration-300 text-center mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-md transition-colors duration-300 hover:cursor-pointer"
                >
                  <FiLogOut />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="op-btn px-4 py-2 bg-[var(--op-primary)] text-white text-center"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
