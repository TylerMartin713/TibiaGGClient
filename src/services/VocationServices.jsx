import { apiRequest } from "../utils/api.js";

export const GetAllVocations = () => {
  return apiRequest(`http://localhost:8000/vocations`);
};

export const GetVocation = (id) => {
  return apiRequest(`http://localhost:8000/vocations/${id}`);
};

export const CreateVocation = (vocationData) => {
  return apiRequest("http://localhost:8000/vocations", {
    method: "POST",
    body: JSON.stringify(vocationData),
  });
};
