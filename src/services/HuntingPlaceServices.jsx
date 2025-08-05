import { apiRequest } from "../utils/api.js";

export const GetAllHuntingPlaces = () => {
  return apiRequest("http://localhost:8000/hunting-places");
};

export const GetHuntingPlace = (id) => {
  return apiRequest(`http://localhost:8000/hunting-places/${id}`);
};

export const CreateHuntingPlace = (huntingPlaceData) => {
  return apiRequest("http://localhost:8000/hunting-places", {
    method: "POST",
    body: JSON.stringify(huntingPlaceData),
  });
};

export const UpdateHuntingPlace = (id, huntingPlaceData) => {
  return apiRequest(`http://localhost:8000/hunting-places/${id}`, {
    method: "PUT",
    body: JSON.stringify(huntingPlaceData),
  });
};

export const DeleteHuntingPlace = (id) => {
  return apiRequest(`http://localhost:8000/hunting-places/${id}`, {
    method: "DELETE",
  });
};

export const AddComment = (huntingPlaceId, commentData) => {
  return apiRequest(
    `http://localhost:8000/hunting-places/${huntingPlaceId}/add_comment`,
    {
      method: "POST",
      body: JSON.stringify(commentData),
    }
  );
};

export const GetComments = (huntingPlaceId) => {
  return apiRequest(
    `http://localhost:8000/hunting-places/${huntingPlaceId}/comments`
  );
};
