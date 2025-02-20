const {userRoles} = require("../helpers/constants");
const registerModel = require("../models/auth.register.model");
const {hash} = require("./hashPassword");
const seedAdmin = async () => {
  try {
    const existingAdmin = await registerModel.findOne({
      email: "admin@gmail.com",
    });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }
    const hashedPassword = hash("12345678");
    // Create a new admin user
    const newAdmin = new registerModel({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: userRoles.ADMIN,
    });
    await newAdmin.save();
    console.log("Admin user seeded successfully");
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

module.exports = seedAdmin;
