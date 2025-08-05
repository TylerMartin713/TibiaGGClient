import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <ul className="navbar pb-10">
      <li>
        <NavLink to="/">TibiaGG</NavLink>
      </li>
      <li>
        <NavLink to="/hunting-places">Hunting Places</NavLink>
      </li>
      <li>
        <NavLink to="/quest-guides">Quest Guides</NavLink>
      </li>
      <li>
        <NavLink to="/profile">Profile</NavLink>
      </li>
      {localStorage.getItem("TibiaGG_token") !== null ? (
        <>
          <li className="navbar__item">
            <button
              onClick={() => {
                localStorage.removeItem("TibiaGG_token");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className="navbar__item">
            <NavLink to={"/login"}>Login</NavLink>
          </li>
          <li className="navbar__item">
            <NavLink to={"/register"}>Register</NavLink>
          </li>
        </>
      )}
    </ul>
  );
};
