import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorized } from "./Authorized";
import { Login } from "./auth/Login.jsx";
import { Register } from "./auth/Register.jsx";
import { HuntingPlaces } from "./hunts/HuntingPlaces.jsx";
import { App } from "../App.jsx";
import { QuestGuides } from "./quests/QuestGuides.jsx";
import { Profile } from "./profile/Profile.jsx";
import { AddHuntingPlace } from "./hunts/AddHuntingPlace.jsx";

export const ApplicationViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Authorized />}>
          <Route path="/" element={<App />} />
          {/* ALL THE HUNTING PLACE ROUTES */}
          <Route path="/hunting-places" element={<HuntingPlaces />} />
          <Route path="/add-hunting-places" element={<AddHuntingPlace />} />

          {/* ALL THE QUITE GUIDE ROUTES */}
          <Route path="/quest-guides" element={<QuestGuides />} />

          {/* ALL THE PROFILE ROUTES */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
