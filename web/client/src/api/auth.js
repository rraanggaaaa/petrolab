import api from "./axios";

// Storage keys
const TOKEN_KEY = "token";
const USER_KEY = "user";

// Helper functions
const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    console.log("Token saved to localStorage");
  }
};

const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log("User saved to localStorage");
  }
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  console.log("Token removed from localStorage");
};

const removeUser = () => {
  localStorage.removeItem(USER_KEY);
  console.log("User removed from localStorage");
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    console.log("Register response:", response.data);

    if (response.data.success && response.data.data?.token) {
      setToken(response.data.data.token);
      setUser(response.data.data.user);
    }

    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    console.log("Login response:", response.data);

    if (response.data.success && response.data.data?.token) {
      setToken(response.data.data.token);
      setUser(response.data.data.user);
      console.log("Login successful, token and user saved");
    } else {
      console.warn("Login response missing token:", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = () => {
  removeToken();
  removeUser();
  console.log("Logout completed");
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log("isAuthenticated check:", !!token);
  return !!token;
};

export const getUserFromStorage = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const getTokenFromStorage = () => {
  return localStorage.getItem(TOKEN_KEY);
};
