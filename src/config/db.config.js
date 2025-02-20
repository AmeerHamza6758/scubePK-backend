const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
