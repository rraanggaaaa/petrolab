"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get user IDs first (assuming admin id = 1, john = 2, jane = 3)
    await queryInterface.bulkInsert("items", [
      {
        name: "Laptop ASUS ROG",
        description: "Gaming laptop with RTX 4060, 16GB RAM, 512GB SSD",
        quantity: 10,
        price: 15000000,
        category: "Electronics",
        user_id: 1, // admin
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "iPhone 15 Pro",
        description: "Apple iPhone 15 Pro 256GB",
        quantity: 5,
        price: 18000000,
        category: "Electronics",
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Meja Kantor",
        description: "Meja kayu ukuran 120x60cm",
        quantity: 20,
        price: 750000,
        category: "Furniture",
        user_id: 2, // john
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Kursi Gaming",
        description: "Kursi gaming ergonomis dengan sandaran kepala",
        quantity: 15,
        price: 1250000,
        category: "Furniture",
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Buku Programming",
        description: "JavaScript: The Good Parts",
        quantity: 50,
        price: 150000,
        category: "Books",
        user_id: 3, // jane
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Mouse Logitech",
        description: "Wireless gaming mouse",
        quantity: 30,
        price: 350000,
        category: "Electronics",
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("items", null, {});
  },
};
