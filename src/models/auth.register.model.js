const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
const { userRoles } = require("../helpers/constants");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const value = this.getDataValue("logo");
        return value ? `${process.env.BASE_URL}/uploads/${value}` : null;
      },
    },
    fbLink: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    instagramLink: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    linkedinLink: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    youtubeLink: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    twitterLink: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    websiteLink: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    phoneNo1: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    phoneNo2: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    address: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    role: {
      type: DataTypes.ENUM,
      values: Object.values(userRoles),
      defaultValue: userRoles.USER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

module.exports = User;
