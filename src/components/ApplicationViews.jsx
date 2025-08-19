import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authorized } from "./Authorized";
import { Login } from "./auth/Login.jsx";
import { Register } from "./auth/Register.jsx";
import { HuntingPlaces } from "./hunts/HuntingPlaces.jsx";
import { App } from "../App.jsx";
import { QuestGuides } from "./quests/QuestGuides.jsx";
import { Profile } from "./profile/Profile.jsx";
import { AddHuntingPlace } from "./hunts/AddHuntingPlace.jsx";
import { HuntingPlaceDetails } from "./hunts/HuntingPlaceDetails.jsx";
import { EditHuntingPlace } from "./hunts/EditHuntingPlace.jsx";
import { AddHuntingLocation } from "./hunts/AddHuntingLocation.jsx";
import { AddCreature } from "./hunts/AddCreature.jsx";

export const ApplicationViews = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Authorized />}>
          {/* HOMEPAGE VIEW */}
          <Route path="/" element={<App />} />
          {/* ALL THE HUNTING PLACE ROUTES */}
          <Route path="/hunting-places" element={<HuntingPlaces />} />
          <Route path="/hunting-places/create" element={<AddHuntingPlace />} />
          <Route path="/hunting-places/:id" element={<HuntingPlaceDetails />} />
          <Route
            path="/hunting-places/:id/edit"
            element={<EditHuntingPlace />}
          />
          <Route
            path="/hunting-places/add-location"
            element={<AddHuntingLocation />}
          />
          <Route
            path="/hunting-places/add-creature"
            element={<AddCreature />}
          />
          {/* ALL THE QUITE GUIDE ROUTES */}
          <Route path="/quest-guides" element={<QuestGuides />} />

          {/* ALL THE PROFILE ROUTES */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
