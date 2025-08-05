import { apiRequest } from "../utils/api.js";

export const GetAllLocations = () => {
  return apiRequest("http://localhost:8000/locations");
};

export const AddLocation = (locationData) => {
  return apiRequest("http://localhost:8000/locations", {
    method: "POST",
    body: JSON.stringify(locationData),
  });
};
