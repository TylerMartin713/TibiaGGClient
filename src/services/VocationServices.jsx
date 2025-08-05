import { apiRequest } from "../utils/api.js";

export const GetAllVocations = () => {
  return apiRequest(`http://localhost:8000/vocations`);
};
