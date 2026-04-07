import * as SecureStore from "expo-secure-store";

// Storage keys
const TOKEN_KEY = "token";
const USER_KEY = "user";

// Token management
export const setToken = async (token) => {
  try {
    if (token && typeof token === "string") {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      console.log("Token saved successfully");
      return true;
    }
    console.log("Invalid token:", token);
    return false;
  } catch (error) {
    console.error("Failed to save token:", error);
    return false;
  }
};

export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log("Token retrieved:", token ? "exists" : "not found");
    return token || null;
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log("Token removed successfully");
    return true;
  } catch (error) {
    console.error("Failed to remove token:", error);
    return false;
  }
};

// User management
export const setUser = async (user) => {
  try {
    if (user && typeof user === "object") {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      console.log("User saved successfully");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to save user:", error);
    return false;
  }
};

export const getUser = async () => {
  try {
    const user = await SecureStore.getItemAsync(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
    console.log("User removed successfully");
    return true;
  } catch (error) {
    console.error("Failed to remove user:", error);
    return false;
  }
};

// Clear all auth data
export const clearAuth = async () => {
  await removeToken();
  await removeUser();
  console.log("Auth data cleared");
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const token = await getToken();
  return !!token;
};
