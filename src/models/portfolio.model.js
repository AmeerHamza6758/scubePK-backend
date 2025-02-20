const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const Portfolio = sequelize.define(
  "Portfolio",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
      get() {
        const value = this.getDataValue("image");
        return value ? `${process.env.BASE_URL}/uploads/${value}` : null;
      },
    },
    logo: {
      type: DataTypes.STRING,
      get() {
        const value = this.getDataValue("logo");
        return value ? `${process.env.BASE_URL}/uploads/${value}` : null;
      },
    },
    platforms: {
      type: DataTypes.STRING,
    },
    downloads: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: "portfolios",
  }
);

module.exports = Portfolio;
