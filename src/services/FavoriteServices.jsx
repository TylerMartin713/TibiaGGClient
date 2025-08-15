import { apiRequest } from "../utils/api.js";

export const GetUserFavorites = async () => {
  try {
    const response = await apiRequest("http://localhost:8000/favorites");
    return response;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }
};

export const AddToFavorites = async (huntingPlaceId) => {
  try {
    const response = await apiRequest("http://localhost:8000/favorites", {
      method: "POST",
      body: JSON.stringify({ hunting_place_id: huntingPlaceId }),
    });
    return response;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

export const RemoveFromFavorites = async (favoriteId) => {
  try {
    const response = await apiRequest(
      `http://localhost:8000/favorites/${favoriteId}`,
      {
        method: "DELETE",
      }
    );
    return response;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

export const ToggleFavorite = async (huntingPlaceId) => {
  try {
    const response = await apiRequest(
      "http://localhost:8000/favorites/toggle",
      {
        method: "POST",
        body: JSON.stringify({ hunting_place_id: huntingPlaceId }),
      }
    );
    return response;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};
