import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-72px)]">
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
