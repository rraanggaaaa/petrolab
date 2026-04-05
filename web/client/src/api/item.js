import api from "./axios";

/**
 * Get all items dengan pagination, filter, dan search
 */
export const getItems = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.category) queryParams.append("category", params.category);
    if (params.search) queryParams.append("search", params.search);

    const url = `/items${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get(url);

    // Backend mengirim: { success, data: { items, pagination } }
    // Kita return dengan struktur yang konsisten
    return {
      success: response.data.success,
      data: {
        items: response.data.data?.items || [],
        pagination: response.data.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      },
      message: response.data.message,
    };
  } catch (error) {
    console.error("Get items error:", error);
    throw error.response?.data || { success: false, message: error.message };
  }
};

/**
 * Get single item by ID
 */
export const getItemById = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return {
      success: response.data.success,
      data: {
        item: response.data.data?.item || null,
      },
      message: response.data.message,
    };
  } catch (error) {
    console.error("Get item by id error:", error);
    throw error.response?.data || { success: false, message: error.message };
  }
};

/**
 * Create new item
 */
export const createItem = async (itemData) => {
  try {
    const response = await api.post("/items", itemData);
    return {
      success: response.data.success,
      data: {
        item: response.data.data?.item || null,
      },
      message: response.data.message,
    };
  } catch (error) {
    console.error("Create item error:", error);
    throw error.response?.data || { success: false, message: error.message };
  }
};

/**
 * Update existing item
 */
export const updateItem = async (id, itemData) => {
  try {
    const response = await api.put(`/items/${id}`, itemData);
    return {
      success: response.data.success,
      data: {
        item: response.data.data?.item || null,
      },
      message: response.data.message,
    };
  } catch (error) {
    console.error("Update item error:", error);
    throw error.response?.data || { success: false, message: error.message };
  }
};

/**
 * Delete item
 */
export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Delete item error:", error);
    throw error.response?.data || { success: false, message: error.message };
  }
};

/**
 * Get all unique categories for current user
 */
export const getCategories = async () => {
  try {
    const response = await api.get("/items/categories");
    return {
      success: response.data.success,
      data: {
        categories: response.data.data?.categories || [],
      },
      message: response.data.message,
    };
  } catch (error) {
    console.error("Get categories error:", error);
    throw error.response?.data || { success: false, message: error.message };
  }
};

/**
 * Get items statistics
 */
export const getItemsStats = async () => {
  try {
    const response = await getItems({ limit: 1000 });

    if (!response.success) {
      throw new Error(response.message);
    }

    const items = response.data.items || [];

    const stats = {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
      totalValue: items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0,
      ),
      lowStockItems: items.filter((item) => (item.quantity || 0) < 5).length,
      categories: [
        ...new Set(items.map((item) => item.category).filter((c) => c)),
      ],
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Get items stats error:", error);
    return {
      success: false,
      data: {
        totalItems: 0,
        totalQuantity: 0,
        totalValue: 0,
        lowStockItems: 0,
        categories: [],
      },
      message: error.message,
    };
  }
};
