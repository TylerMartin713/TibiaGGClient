import { apiRequest } from "../utils/api.js";

export const GetAllHuntingPlaces = () => {
  return apiRequest("http://localhost:8000/hunting-places");
};

export const CreateHuntingPlace = (huntingPlaceData) => {
  return apiRequest("http://localhost:8000/hunting-places", {
    method: "POST",
    body: JSON.stringify(huntingPlaceData),
  });
};
