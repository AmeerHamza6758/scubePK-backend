const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const CmsModel = sequelize.define(
  "cms_data",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    aboutUs: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "About Us",
    },
    termsAndConditions: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Terms and Conditions",
    },
    privacyPolicy: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Privacy Policy",
    },
  },
  {
    timestamps: true,
    tableName: "cms_data",
  }
);

module.exports = CmsModel;
