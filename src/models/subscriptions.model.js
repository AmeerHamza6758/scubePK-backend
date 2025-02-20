const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const SubscriptionModel = sequelize.define(
  "subscriptions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subscriptionEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
  },
  {
    timestamps: true,
    tableName: "subscriptions",
  }
);

module.exports = SubscriptionModel;
