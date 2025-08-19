import { apiRequest } from "../utils/api.js";

export const GetAllCreatures = () => {
  return apiRequest("http://localhost:8000/creatures");
};

export const GetCreature = (id) => {
  return apiRequest(`http://localhost:8000/creatures/${id}`);
};

export const SearchCreatures = (query) => {
  return apiRequest(
    `http://localhost:8000/creatures/search?q=${encodeURIComponent(query)}`
  );
};

export const SearchAndAddCreature = (creatureName) => {
  return apiRequest(`http://localhost:8000/api/creature/${creatureName}/`);
};
