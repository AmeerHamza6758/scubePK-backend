const {
  hash: hashPassword,
  compare: comparePassword,
  generateRandomPassword,
} = require("../utils/hashPassword");
const User = require("../models/auth.register.model");
const jwtToken = require("../utils/jwtToken");
const { transporter } = require("../config/mail.config");

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, ...optionalFields } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ status: false, message: "Email is required" });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: `User ${existingUser.name} already registered`,
        });
      }

      if (req.file) {
        optionalFields.logo = req.file.filename;
      }

      const hashedPass = await hashPassword(password);
      const newUser = await User.create({
        name,
        email,
        password: hashedPass,
        ...optionalFields,
      });

      // Send email notification
      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "Welcome to SCubepk",
        text: `You are registered successfully.`,
      };
      await transporter.sendMail(mailOptions);

      res.status(201).json({
        status: true,
        message: "User registered successfully",
        user: newUser,
      });
    } catch (error) {
      console.error("Error while creating user:", error.message);
      res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ status: false, message: "Email is required" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ status: false, message: "Incorrect password" });
      }

      const token = jwtToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        status: true,
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.log(error, "Login Error");
      res.status(500).json({ status: false, message: "Login failed" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const existingUser = await User.findByPk(id);
      if (!existingUser) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      if (updatedData.password) {
        updatedData.password = await hashPassword(updatedData.password);
      }

      if (req.file) {
        updatedData.logo = req.file.filename;
      }

      await User.update(updatedData, { where: { id }, returning: true });

      const updatedUser = await User.findByPk(id);

      res.status(200).json({
        status: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error.message);
      res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (!existingUser) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }

      const randomPassword = generateRandomPassword();
      const hashedPassword = await hashPassword(randomPassword);

      await User.update(
        { password: hashedPassword },
        { where: { id: existingUser.id } }
      );

      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "Password Reset",
        text: `Your new password is ${randomPassword}.`,
      };
      await transporter.sendMail(mailOptions);

      res.status(200).json({
        status: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
      res
        .status(200)
        .json({ status: true, data: user, message: "User successfully" });
    } catch (error) {
      console.error("Error fetching user by ID:", error.message);
      res
        .status(500)
        .json({ status: false, message: "Server error", error: error.message });
    }
  },
};

module.exports = authController;
