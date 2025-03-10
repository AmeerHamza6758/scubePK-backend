const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const AwardsAndCertifications = require("../models/awardsAndCertificate.model");

const awardsAndCertificationsController = {
  create: async (req, res) => {
    try {
      const { title, description, type } = req.body;
      const existingAward = await AwardsAndCertifications.findOne({ where: { title } });

      if (existingAward) {
        return res.status(409).json({
          status: false,
          message: "Award already exists",
        });
      }

      let image = req.file ? req.file.filename : null;

      const award = await AwardsAndCertifications.create({
        title,
        description,
        image,
        type
      });

      res.status(201).json({
        status: true,
        message: "Award created successfully",
        data: award,
      });
    } catch (error) {
      console.error("Error creating award:", error.message);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  },

  getAll: async (req, res) => {
    try {
      let { offset = 0, limit = 10, search = "" } = req.query;
      offset = parseInt(offset);
      limit = parseInt(limit);

      let whereClause = search ? { type: { [Op.like]: `%${search}%` } } : {};

      const awardsData = await AwardsAndCertifications.findAll({
        where: whereClause,
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        status: true,
        data: awardsData,
        message: "Awards and Certifications fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching awards:", error.message);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  },

  getAwardById: async (req, res) => {
    try {
      const { id } = req.params;
      const awardData = await AwardsAndCertifications.findByPk(id);

      if (!awardData) {
        return res.status(404).json({ status: false, message: "Award not found" });
      }

      res.status(200).json({
        status: true,
        data: awardData,
        message: "Award fetched successfully",
      });
    } catch (error) {
      console.error("Error getting award:", error.message);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  },

  updateAward: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const award = await AwardsAndCertifications.findByPk(id);

      if (!award) {
        return res.status(404).json({ status: false, message: "Award not found" });
      }

      if (title) {
        const existingTitle = await AwardsAndCertifications.findOne({ where: { title } });
        if (existingTitle && existingTitle.id !== id) {
          return res.status(409).json({ status: false, message: "Title already exists" });
        }
      }

      let newImage = award.image;
      if (req.file) {
        if (award.image) {
          const oldImagePath = path.join(__dirname, `../uploads/${award.image}`);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        newImage = req.file.filename;
      }

      await award.update({ title, description, image: newImage });

      res.status(200).json({
        status: true,
        message: "Award updated successfully",
        data: award,
      });
    } catch (error) {
      console.error("Error updating award:", error.message);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  },

  removeAward: async (req, res) => {
    try {
      const { id } = req.params;
      const award = await AwardsAndCertifications.findByPk(id);

      if (!award) {
        return res.status(404).json({ status: false, message: "Award not found" });
      }

      if (award.image) {
        const imagePath = path.join(__dirname, `../uploads/${award.image}`);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await award.destroy();

      res.status(200).json({
        status: true,
        message: "Award deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting award:", error.message);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  },
};

module.exports = awardsAndCertificationsController;
