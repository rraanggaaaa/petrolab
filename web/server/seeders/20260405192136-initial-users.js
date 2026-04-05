"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const userPassword = await bcrypt.hash("user123", salt);

    await queryInterface.bulkInsert("users", [
      {
        username: "admin",
        email: "admin@example.com",
        password_hash: adminPassword,
        role: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "john_doe",
        email: "john@example.com",
        password_hash: userPassword,
        role: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        password_hash: userPassword,
        role: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
