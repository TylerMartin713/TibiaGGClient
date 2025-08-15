export const authenticatedFetch = (url, options = {}) => {
  const token = JSON.parse(localStorage.getItem("TibiaGG_token"))?.token;

  const defaultOptions = {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

export const apiRequest = async (url, options = {}) => {
  try {
    const response = await authenticatedFetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content responses (no JSON body expected)
    if (response.status === 204) {
      return null;
    }

    // Try to parse JSON, but handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
