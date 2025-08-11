import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "./nav/Navbar.jsx";

export const Authorized = () => {
  if (localStorage.getItem("TibiaGG_token")) {
    return (
      <>
        <NavBar />
        <main className="bg-gray-200">
          <Outlet />
        </main>
      </>
    );
  }
  return <Navigate to="/login" replace />;
};
