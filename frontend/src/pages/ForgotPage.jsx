import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";

const API_BASE_URL = "http://localhost:5000";

function ForgotPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage("");
        
        try {
            const response = await fetch(`${API_BASE_URL}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to send reset link.");
            }
            setMessage("Reset link sent! Please check your email.");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[100vh] flex flex-col md:flex-row justify-center items-center min-h-screen">
            <div className="bg-[#f8f8f8] h-full w-1/2 flex justify-center items-center p-8 hidden md:flex">
                <Link to="/">
                    <img src={logo} className="h-[30vh]" />
                </Link>
            </div>
            <div className="bg-[#225975] w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8">
                <h2 className="text-[#fff] text-3xl h-[7%] font-bold">
                    Forgot Password
                </h2>
                <p className="text-[#fff] h-[7%]">Enter your email and we&apos;ll send you a link to reset your password.</p>
                <form
                    className="flex flex-col h-[20%] justify-around w-full max-w-md"
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
                   
                    <button
                        className="w-full p-4 rounded-md bg-black text-white font-semibold"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                    </button>
                </form>
                {message && (
                    <div className="mt-4 text-green-400">{message}</div>
                )}
                {error && (
                    <div className="mt-4 text-red-400">{error}</div>
                )}
                <div className="h-[10%] flex flex-col justify-evenly items-center">
                    <p>
                        Have an account? Login{" "}
                        <Link
                            className="text-[#FFE34A] transition-colors duration-200 underline "
                            to="/login"
                        >
                            here
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPage;
