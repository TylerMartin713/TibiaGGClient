import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "./nav/Navbar.jsx";

export const Authorized = () => {
  if (localStorage.getItem("TibiaGG_token")) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <main className="bg-gray-900">
          <Outlet />
        </main>
      </div>
    );
  }
  return <Navigate to="/login" replace />;
};
