const Portfolio = require("../models/portfolio.model");

const portfolioController = {
  createPortfolio: async (req, res) => {
    try {
      const { title, description, platforms, downloads, type } = req.body;

      if (!req.files || !req.files.image || !req.files.logo) {
        return res.status(400).json({
          status: false,
          message: "Both image and logo are required",
        });
      }

      const existingPortfolio = await Portfolio.findOne({ where: { title } });

      if (existingPortfolio) {
        return res
          .status(409)
          .json({ status: false, message: "Portfolio already exists" });
      }

      const imagePath = req.files.image[0].filename;
      const logoPath = req.files.logo[0].filename;

      const newPortfolio = await Portfolio.create({
        title,
        description,
        image: imagePath,
        logo: logoPath,
        platforms,
        downloads,
        type,
      });

      res.status(201).json({
        status: true,
        data: newPortfolio,
        message: "Portfolio created successfully",
      });
    } catch (error) {
      console.error("Error creating portfolio:", error.message);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getAllPortfolio: async (req, res) => {
    try {
      let { offset = 0, limit = 10, search = "" } = req.query;
      offset = parseInt(offset, 10);
      limit = parseInt(limit, 10);

      let whereCondition = search
        ? { title: { [Op.like]: `%${search}%` } }
        : {};

      const { rows, count } = await Portfolio.findAndCountAll({
        where: whereCondition,
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        status: true,
        data: rows,
        totalCount: count,
        message: "Portfolio list fetched successfully",
      });
    } catch (error) {
      console.log("Error getting all portfolio", error.message);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getPortfolioById: async (req, res) => {
    try {
      const { id } = req.params;
      const portfolio = await Portfolio.findByPk(id);

      if (!portfolio) {
        return res
          .status(404)
          .json({ status: false, message: "Portfolio not found" });
      }

      res.status(200).json({
        status: true,
        data: portfolio,
        message: "Portfolio fetched successfully",
      });
    } catch (error) {
      console.log("Error getting portfolio by id", error.message);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  updatePortfolio: async (req, res) => {
    try {
      const { id } = req.params;
      const portfolio = await Portfolio.findByPk(id);

      if (!portfolio) {
        return res.status(404).json({
          status: false,
          message: "Portfolio not found",
        });
      }

      const updateData = req.body;

      if (req.files) {
        if (req.files["image"]) {
          updateData.image = req.files["image"][0].filename;
        }
        if (req.files["logo"]) {
          updateData.logo = req.files["logo"][0].filename;
        }
      }

      await Portfolio.update(updateData, { where: { id } });

      const updatedPortfolio = await Portfolio.findByPk(id);

      res.status(200).json({
        status: true,
        data: updatedPortfolio,
        message: "Portfolio updated successfully",
      });
    } catch (error) {
      console.log("Error updating portfolio", error.message);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  deletePortfolio: async (req, res) => {
    try {
      const { id } = req.params;
      const portfolio = await Portfolio.findByPk(id);

      if (!portfolio) {
        return res
          .status(404)
          .json({ status: false, message: "Portfolio not found" });
      }

      await Portfolio.destroy({ where: { id } });

      res.status(200).json({
        status: true,
        message: "Portfolio deleted successfully",
      });
    } catch (error) {
      console.log("Error deleting portfolio", error.message);
      res.status(500).json({ status: false, message: error.message });
    }
  },
};

module.exports = portfolioController;
