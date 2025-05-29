import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[100vh] flex flex-row justify-center items-center min-h-screen">
            <div className="bg-[#f8f8f8] h-full w-1/2 flex justify-center items-center p-8">
                <Link to="/">
                    <img src={logo} alt="RallyPoint logo" className="h-[30vh]" />
                </Link>
            </div>
            <div className="bg-[#225975] w-1/2 h-full flex flex-col justify-center items-center p-8">
                <h2 className="text-[#fff] text-3xl h-[10%] font-bold">
                    Login
                </h2>
                {error && <div>{error}</div>}
                <form
                    className="flex flex-col h-[30%] justify-around w-[60%]"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        disabled={isLoading}
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
            </div>
        </div>
    );
};

export default LoginPage;
