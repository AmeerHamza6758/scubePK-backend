const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const AwardsAndCertifications = sequelize.define(
  "awards_and_certifications",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("image");
        return rawValue ? `${process.env.BASE_URL}/uploads/${rawValue}` : null;
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "awards_and_certifications",
  }
);

module.exports = AwardsAndCertifications;
