const { Op } = require("sequelize");
const { getModels } = require("../models");
const bcrypt = require("bcryptjs");

let User = null;

const initModels = async () => {
  const models = await getModels();
  User = models.User;
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    if (!User) await initModels();

    const { search, page = 1, limit = 10 } = req.query;

    let where = {};

    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password_hash"] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    if (!User) await initModels();

    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
  try {
    if (!User) await initModels();

    const { username, email, password, role = "user" } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password_hash: passwordHash,
      role,
    });

    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    if (!User) await initModels();

    const { id } = req.params;
    const { username, email, role } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if username/email already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        where: { username },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already taken",
        });
      }
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already taken",
        });
      }
    }

    await user.update({
      username: username || user.username,
      email: email || user.email,
      role: role || user.role,
    });

    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    res.json({
      success: true,
      message: "User updated successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    if (!User) await initModels();

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    if (!User) await initModels();

    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.update({ role });

    const userResponse = user.toJSON();
    delete userResponse.password_hash;

    res.json({
      success: true,
      message: "User role updated successfully",
      data: { user: userResponse },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
};
