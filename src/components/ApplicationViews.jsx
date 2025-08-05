import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorized } from "./Authorized";
import { Login } from "./auth/Login.jsx";
import { Register } from "./auth/Register.jsx";
import { HuntingPlaces } from "./hunts/HuntingPlaces.jsx";
import { App } from "../App.jsx";
import { QuestGuides } from "./quests/QuestGuides.jsx";
import { Profile } from "./profile/Profile.jsx";

export const ApplicationViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Authorized />}>
          <Route path="/" element={<App />} />
          <Route path="/hunting-places" element={<HuntingPlaces />} />
          <Route path="/quest-guides" element={<QuestGuides />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
