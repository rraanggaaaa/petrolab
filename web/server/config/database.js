const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

// Function to create database if not exists
const createDatabaseIfNotExists = async () => {
  try {
    // Create connection without database name first
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    // Check if database exists
    const [databases] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${DB_NAME}'`,
    );

    if (databases.length === 0) {
      console.log(`📦 Database '${DB_NAME}' does not exist. Creating...`);
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
      console.log(`✅ Database '${DB_NAME}' created successfully!`);
    } else {
      console.log(`✅ Database '${DB_NAME}' already exists.`);
    }

    await connection.end();
    return true;
  } catch (error) {
    console.error("❌ Error creating database:", error.message);
    throw error;
  }
};

// Create Sequelize instance AFTER database exists
let sequelize = null;

const getSequelize = async () => {
  if (!sequelize) {
    // Ensure database exists first
    await createDatabaseIfNotExists();

    // Now create Sequelize connection with database
    sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      dialect: "mysql",
      port: 3306,
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }
  return sequelize;
};

const testConnection = async () => {
  try {
    const sequelizeInstance = await getSequelize();
    await sequelizeInstance.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
    process.exit(1);
  }
};

module.exports = { getSequelize, testConnection, createDatabaseIfNotExists };
