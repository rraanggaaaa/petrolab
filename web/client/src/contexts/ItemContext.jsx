import React, { createContext, useState, useCallback } from 'react';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getCategories
} from '../api/item';

export const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchItems = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getItems(params);

      if (response.success) {
        setItems(response.data.items || []);
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        });
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to fetch items');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch items';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchItemById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getItemById(id);

      if (response.success) {
        return { success: true, item: response.data.item };
      } else {
        setError(response.message || 'Item not found');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createNewItem = async (itemData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createItem(itemData);

      if (response.success) {
        await fetchItems({ page: pagination.page, limit: pagination.limit });
        return { success: true, item: response.data.item };
      } else {
        setError(response.message || 'Failed to create item');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to create item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateExistingItem = async (id, itemData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateItem(id, itemData);

      if (response.success) {
        await fetchItems({ page: pagination.page, limit: pagination.limit });
        return { success: true, item: response.data.item };
      } else {
        setError(response.message || 'Failed to update item');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingItem = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteItem(id);

      if (response.success) {
        await fetchItems({ page: pagination.page, limit: pagination.limit });
        return { success: true };
      } else {
        setError(response.message || 'Failed to delete item');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();

      if (response.success) {
        setCategories(response.data.categories || []);
        return { success: true, categories: response.data.categories };
      } else {
        return { success: false };
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      return { success: false };
    }
  }, []);

  const value = {
    items,
    categories,
    loading,
    error,
    pagination,
    fetchItems,
    fetchItemById,
    createItem: createNewItem,
    updateItem: updateExistingItem,
    deleteItem: deleteExistingItem,
    fetchCategories,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};