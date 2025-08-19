import { Navigate, Outlet } from "react-router-dom";
import { NavBar } from "./nav/Navbar.jsx";
import { Footer } from "./footer/footer.jsx";

export const Authorized = () => {
  if (localStorage.getItem("TibiaGG_token")) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <NavBar />
        <main className="bg-gray-900 flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }
  return <Navigate to="/login" replace />;
};
