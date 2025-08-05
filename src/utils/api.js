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

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
