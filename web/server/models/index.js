const { getSequelize } = require("../config/database");

// We'll initialize models after sequelize is ready
let User = null;
let Item = null;
let sequelize = null;

const initModels = async () => {
  // Get sequelize instance
  sequelize = await getSequelize();

  // Import models with the sequelize instance
  const UserModel = require("./User");
  const ItemModel = require("./Item");

  // Initialize models
  User = UserModel(sequelize);
  Item = ItemModel(sequelize);

  // Setup associations
  User.hasMany(Item, {
    foreignKey: "user_id",
    as: "items",
    onDelete: "CASCADE",
  });
  Item.belongsTo(User, { foreignKey: "user_id", as: "user" });

  return { User, Item, sequelize };
};

// Export a promise that resolves to models
module.exports = {
  initModels,
  getModels: async () => {
    if (!User || !Item) {
      await initModels();
    }
    return { User, Item, sequelize };
  },
};
