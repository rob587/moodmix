const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const analyzeEmotion = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/emotion/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Errore analyzeEmotion:", error);
    throw error;
  }
};

export const generatePlaylist = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/playlist/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Errore generatePlaylist:", error);
    throw error;
  }
};

export const getHistory = async (userId, limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/emotion/history/${userId}?limit=${limit}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Errore getHistory:", error);
    throw error;
  }
};

export const getPlaylists = async (userId, limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/playlist/user/${userId}?limit=${limit}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Errore HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Errore getPlaylists:", error);
    throw error;
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check fallita: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Health check fallita:", error);
    throw error;
  }
};
