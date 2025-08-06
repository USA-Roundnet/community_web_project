import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import logo from "../assets/rallypoint-logo.png";

const API_BASE_URL = "http://localhost:5000";

function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError("Invalid password reset link.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setMessage("");
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password.");
            }
            
            setMessage("Your password has been reset successfully!");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
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
                    <img src={logo} className="h-[30vh]" alt="Rally Point Logo" />
                </Link>
            </div>
            <div className="bg-[#225975] w-full md:w-1/2 h-full flex flex-col justify-center items-center p-8">
                <h2 className="text-[#fff] text-3xl h-[7%] font-bold">
                    Reset Password
                </h2>
                <p className="text-[#fff] h-[7%]">Please enter your new password.</p>
                <form
                    className="flex flex-col h-[30%] justify-around w-full max-w-md"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none mb-4"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                    />
                    <input
                        className="w-full p-4 rounded-md bg-gray-200 text-black border border-gray-400 focus:ring-2 focus:ring-black focus:outline-none mb-4"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        required
                    />
                   
                    <button
                        className="w-full p-4 rounded-md bg-black text-white font-semibold"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Resetting Password..." : "Reset Password"}
                    </button>
                </form>
                {message && (
                    <div className="mt-4 text-green-400">{message}</div>
                )}
                {error && (
                    <div className="mt-4 text-red-400">{error}</div>
                )}
                <div className="h-[10%] flex flex-col justify-evenly items-center">
                    <p className="text-white">
                        Remember your password? Login{" "}
                        <Link
                            className="text-[#FFE34A] transition-colors duration-200 underline"
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

export default ResetPasswordPage;
