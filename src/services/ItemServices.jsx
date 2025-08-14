import { apiRequest } from "../utils/api.js";

export const GetAllItems = async () => {
  try {
    const response = await apiRequest("http://localhost:8000/items");
    return response;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const GetItem = async (id) => {
  try {
    const response = await apiRequest(`http://localhost:8000/items/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error;
  }
};

export const CreateItem = async (itemData) => {
  try {
    const response = await apiRequest("http://localhost:8000/items", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
    return response;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

export const UpdateItem = async (id, itemData) => {
  try {
    const response = await apiRequest(`http://localhost:8000/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
    return response;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

export const DeleteItem = async (id) => {
  try {
    const response = await apiRequest(`http://localhost:8000/items/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};
