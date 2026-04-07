import api from "./axios";

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    console.log("Login API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error.response?.data || error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
