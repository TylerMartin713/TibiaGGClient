import { apiRequest } from "../utils/api.js";

export const GetAllImbues = () => {
  return apiRequest("http://localhost:8000/imbues");
};

export const GetImbue = (id) => {
  return apiRequest(`http://localhost:8000/imbues/${id}`);
};

export const CreateImbue = (imbue) => {
  return apiRequest("http://localhost:8000/imbues", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imbue),
  });
};

export const UpdateImbue = (imbue) => {
  return apiRequest(`http://localhost:8000/imbues/${imbue.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imbue),
  });
};

export const DeleteImbue = (id) => {
  return apiRequest(`http://localhost:8000/imbues/${id}`, {
    method: "DELETE",
  });
};
