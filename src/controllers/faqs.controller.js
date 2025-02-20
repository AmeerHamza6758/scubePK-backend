const FAQ = require("../models/faqs.model");

const faqsController = {
  createFaqs: async (req, res) => {
    try {
      const { question, answer, type } = req.body;
      const faq = await FAQ.create({ question, answer, type });
      res.status(201).json({ status: true, message: "FAQ created successfully", data: faq });
    } catch (error) {
      console.error("Error while creating FAQ:", error);
      res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
  },

  getAllFaqs: async (req, res) => {
    try {
      let { offset = 0, limit = 10, search } = req.query;
      offset = parseInt(offset);
      limit = parseInt(limit);
      
      let whereClause = search ? { question: { [Op.iLike]: `%${search}%` } } : {};
      const data = await FAQ.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        status: true,
        data: data.rows,
        totalCount: data.count,
        message: "FAQs retrieved successfully",
      });
    } catch (error) {
      console.error("Error while fetching FAQs:", error);
      res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
  },

  updateFaqs: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedFaq = await FAQ.update(req.body, { where: { id }, returning: true });

      if (updatedFaq[0] === 0) {
        return res.status(404).json({ status: false, message: "FAQ not found" });
      }

      res.status(200).json({
        status: true,
        data: updatedFaq[1][0],
        message: "FAQ updated successfully",
      });
    } catch (error) {
      console.error("Error while updating FAQ:", error);
      res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
  },

  deleteFaqs: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedFaq = await FAQ.destroy({ where: { id } });

      if (!deletedFaq) {
        return res.status(404).json({ status: false, message: "FAQ not found" });
      }

      res.status(200).json({ status: true, message: "FAQ deleted successfully" });
    } catch (error) {
      console.error("Error while deleting FAQ:", error);
      res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
  },
};

module.exports = faqsController;
