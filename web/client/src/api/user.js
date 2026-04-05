import api from "./axios";

// Get all users (admin only)
export const getUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);

    const url = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create new user
export const createUser = async (userData) => {
  try {
    const response = await api.post("/admin/users", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user role
export const updateUserRole = async (id, role) => {
  try {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
