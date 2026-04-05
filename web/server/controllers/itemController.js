const { Op } = require("sequelize");
const { getModels } = require("../models");

let Item = null;

const initModels = async () => {
  const models = await getModels();
  Item = models.Item;
};

const getAllItems = async (req, res) => {
  try {
    if (!Item) await initModels();

    const { category, search, page = 1, limit = 10 } = req.query;

    // Jika user adalah ADMIN, tidak perlu filter user_id
    // Jika user biasa, filter berdasarkan user_id
    let where = {};

    if (req.user.role !== "admin") {
      where.user_id = req.user.id;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const offset = (page - 1) * limit;

    const { count, rows: items } = await Item.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};

const getItemById = async (req, res) => {
  try {
    if (!Item) await initModels();

    const { id } = req.params;

    // Jika user adalah ADMIN, cari item tanpa filter user_id
    // Jika user biasa, filter berdasarkan user_id
    let where = { id };

    if (req.user.role !== "admin") {
      where.user_id = req.user.id;
    }

    const item = await Item.findOne({ where });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      data: { item },
    });
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch item",
    });
  }
};

const createItem = async (req, res) => {
  try {
    if (!Item) await initModels();

    const { name, description, quantity, price, category } = req.body;

    const item = await Item.create({
      name,
      description,
      quantity,
      price,
      category,
      user_id: req.user.id, // Tetap menggunakan user_id dari user yang login
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: { item },
    });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error.message,
    });
  }
};

const updateItem = async (req, res) => {
  try {
    if (!Item) await initModels();

    const { id } = req.params;
    const { name, description, quantity, price, category } = req.body;

    // Cek item exists
    let where = { id };

    // Untuk update, admin bisa update semua item, user biasa hanya item miliknya
    if (req.user.role !== "admin") {
      where.user_id = req.user.id;
    }

    const item = await Item.findOne({ where });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await item.update({
      name,
      description,
      quantity,
      price,
      category,
    });

    res.json({
      success: true,
      message: "Item updated successfully",
      data: { item },
    });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update item",
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    if (!Item) await initModels();

    const { id } = req.params;

    // Untuk delete, admin bisa delete semua item, user biasa hanya item miliknya
    let where = { id };

    if (req.user.role !== "admin") {
      where.user_id = req.user.id;
    }

    const deleted = await Item.destroy({ where });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    if (!Item) await initModels();

    const { Sequelize } = require("sequelize");

    // Jika user adalah ADMIN, ambil semua categories dari semua user
    // Jika user biasa, hanya categories dari items miliknya
    let where = { category: { [Op.not]: null } };

    if (req.user.role !== "admin") {
      where.user_id = req.user.id;
    }

    const categories = await Item.findAll({
      where,
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("category")), "category"],
      ],
      order: [["category", "ASC"]],
    });

    res.json({
      success: true,
      data: { categories: categories.map((c) => c.category) },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getCategories,
};
