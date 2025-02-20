const CmsModel = require("../models/cms.model");

const cmsController = {
  createCMS: async (req, res) => {
    try {
      const existingCMS = await CmsModel.findOne();
      if (existingCMS) {
        return res.status(400).json({
          status: false,
          message: "CMS data already exists. Please update instead.",
        });
      }

      const cmsData = await CmsModel.create(req.body);
      res.status(201).json({
        status: true,
        message: "CMS created successfully",
        data: cmsData,
      });
    } catch (error) {
      console.error("Error while creating CMS:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getCMS: async (req, res) => {
    try {
      const cmsData = await CmsModel.findOne();
      if (!cmsData) {
        return res.status(404).json({ status: false, message: "CMS not found" });
      }
      res.json({
        status: true,
        message: "CMS retrieved successfully",
        data: cmsData,
      });
    } catch (error) {
      console.error("Error while fetching CMS:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  updateCMS: async (req, res) => {
    try {
      const cmsData = await CmsModel.findOne();
      if (!cmsData) {
        return res.status(404).json({ status: false, message: "CMS not found" });
      }

      await CmsModel.update(req.body, { where: { id: cmsData.id } });

      const updatedCMS = await CmsModel.findByPk(cmsData.id);
      res.json({
        status: true,
        message: "CMS updated successfully",
        data: updatedCMS,
      });
    } catch (error) {
      console.error("Error while updating CMS:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },
};

module.exports = cmsController;
