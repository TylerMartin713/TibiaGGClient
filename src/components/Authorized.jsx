import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "./nav/Navbar.jsx";

export const Authorized = () => {
  if (localStorage.getItem("TibiaGG_token")) {
    return (
      <>
        <NavBar />
        <main>
          <Outlet />
        </main>
      </>
    );
  }
  return <Navigate to="/login" replace />;
};
