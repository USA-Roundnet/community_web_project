import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

function App() {
    const noLayout = ["/login", "/register", "/forgot-password"];
    const showLayout = !noLayout.includes(window.location.pathname);

    return (
        <Router>
            {showLayout && <Navbar />}
            <AppRoutes />
        </Router>
    );
}

export default App;
