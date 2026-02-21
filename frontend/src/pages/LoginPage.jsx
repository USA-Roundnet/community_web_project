import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";

import { API_BASE_URL } from "../config";

const LoginPage = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const storeSessionFromToken = (token) => {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("authToken", token);
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            localStorage.setItem("userId", payload.id);
        } catch {
            // token decode failed, continue anyway
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromCallback = params.get("token");
        const oauthError = params.get("error");

        if (tokenFromCallback) {
            storeSessionFromToken(tokenFromCallback);
            navigate("/", { replace: true });
            return;
        }

        if (oauthError) {
            setError(oauthError);
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, password: form.password }),
                credentials: "include",
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(
                    data.message ||
                        "Login failed. Please check your credentials."
                );
            }
            const data = await response.json();
            storeSessionFromToken(data.token);
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.assign(`${API_BASE_URL}/api/auth/google`);
    };

    return (
        <div className="h-[100vh] flex flex-col md:flex-row justify-center items-center min-h-screen">
            <div className="bg-[#f8f8f8] h-full w-1/2 flex justify-center items-center p-8 hidden md:flex">
                <Link to="/">
                    <img
                        src={logo}
                        alt="RallyPoint logo"
                        className="h-[30vh]"
                    />
                </Link>
            </div>
            <div className="bg-[#225975] w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8">
                <h2 className="text-[#fff] text-3xl h-[10%] font-bold">
                    Login
                </h2>
                {error && <div className="w-full max-w-md mb-3 p-3 bg-red-500/20 border border-red-400 text-red-200 rounded-md text-sm text-center">{error}</div>}
                <form
                    className="flex flex-col h-[30%] justify-around w-full max-w-md"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                        type="email"
                        id="email"
                        value={form.email}
                        onChange={(e) => setForm({
                            ...form,
                            email: e.target.value
                        })}
                        placeholder="Email"
                        required
                    />
                    <input
                        className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                        type="password"
                        id="password"
                        value={form.password}
                        onChange={(e) => setForm({
                            ...form,
                            password: e.target.value
                        })}
                        placeholder="Password"
                        required
                    />
                    <p>
                        Forgot your password? Reset it{" "}
                        <Link
                            className="text-[#FFE34A] transition-colors duration-200 underline "
                            to="/forgot"
                        >
                            here
                        </Link>
                        .
                    </p>
                    <button
                        className="w-full p-4 rounded-md bg-black text-white font-semibold"
                        type="submit"
                        disabled={isLoading || !form.email || !form.password}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="h-[10%] flex flex-col justify-evenly items-center">
                    <p>
                        Don&apos;t have an account? Sign up{" "}
                        <Link
                            className="text-[#FFE34A] transition-colors duration-200 underline "
                            to="/register"
                        >
                            here
                        </Link>
                        .
                    </p>
                </div>
                <div className="w-[60%] h-[3%]">
                    <hr />
                </div>

                <div className="w-[60%] h-[15%] flex flex-col justify-evenly items-center">
                    <p className="text-[#fff] text-lg mb-2">Other ways to login</p>
                    <div className="w-full max-w-md">
                        <button
                            className="w-full p-4 rounded-md bg-black text-white font-semibold"
                            type="button"
                            disabled={isLoading}
                            onClick={handleGoogleLogin}
                        >
                            Log in with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
