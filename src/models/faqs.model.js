const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const FAQ = sequelize.define("FAQ", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: "faqs",
});

module.exports = FAQ;
