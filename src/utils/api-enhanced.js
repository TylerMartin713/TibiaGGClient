// Enhanced api.js with best practices

// Base URL configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Token management utilities
const getToken = () => {
  try {
    const tokenData = localStorage.getItem("TibiaGG_token");
    return tokenData ? JSON.parse(tokenData)?.token : null;
  } catch (error) {
    console.warn("Failed to parse token from localStorage:", error);
    return null;
  }
};

const removeToken = () => {
  localStorage.removeItem("TibiaGG_token");
};

// Enhanced authenticated fetch with better error handling
export const authenticatedFetch = (url, options = {}) => {
  const token = getToken();

  // Build full URL if relative path provided
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Token ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  return fetch(fullUrl, defaultOptions);
};

// Enhanced API request with better error handling and response types
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await authenticatedFetch(url, options);

    // Handle different response types
    if (response.status === 204) {
      // No content responses (like DELETE)
      return null;
    }

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        removeToken();
        window.location.href = "/login";
        throw new Error("Authentication failed. Please log in again.");
      }

      // Try to parse error response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch {
        // If we can't parse error JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Handle different content types
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Convenience methods for common HTTP verbs
export const api = {
  get: (url, options = {}) => apiRequest(url, { ...options, method: "GET" }),

  post: (url, data, options = {}) =>
    apiRequest(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (url, data, options = {}) =>
    apiRequest(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: (url, data, options = {}) =>
    apiRequest(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (url, options = {}) =>
    apiRequest(url, { ...options, method: "DELETE" }),
};

// Export utilities
export { getToken, removeToken, BASE_URL };
