import { apiRequest } from "../utils/api.js";

export const GetUserCharacters = async () => {
  try {
    const response = await apiRequest("http://localhost:8000/characters");
    return response;
  } catch (error) {
    console.error("Error fetching user characters:", error);
    throw error;
  }
};

export const GetCharacter = async (id) => {
  try {
    const response = await apiRequest(`http://localhost:8000/characters/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching character:", error);
    throw error;
  }
};

export const CreateCharacter = async (characterData) => {
  try {
    const response = await apiRequest("http://localhost:8000/characters", {
      method: "POST",
      body: JSON.stringify(characterData),
    });
    return response;
  } catch (error) {
    console.error("Error creating character:", error);
    throw error;
  }
};

export const UpdateCharacter = async (id, characterData) => {
  try {
    const response = await apiRequest(
      `http://localhost:8000/characters/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(characterData),
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating character:", error);
    throw error;
  }
};

export const DeleteCharacter = async (id) => {
  try {
    const response = await apiRequest(
      `http://localhost:8000/characters/${id}`,
      {
        method: "DELETE",
      }
    );
    return response;
  } catch (error) {
    console.error("Error deleting character:", error);
    throw error;
  }
};

export const SearchAndAddCharacter = async (characterName) => {
  try {
    const response = await apiRequest(
      `http://localhost:8000/api/character/${characterName}`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    console.error("Error searching and adding character:", error);
    throw error;
  }
};
