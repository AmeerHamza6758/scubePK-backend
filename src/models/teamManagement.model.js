const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
const TeamManagement = sequelize.define(
  "TeamManagement",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("image");
        return rawValue ? `${process.env.BASE_URL}/uploads/${rawValue}` : null;
      },
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "team_management",
  }
);

module.exports = TeamManagement;
