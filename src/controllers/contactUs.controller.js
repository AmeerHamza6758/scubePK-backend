const ContactModel = require("../models/contactUs.model");
const SubscriptionModel = require("../models/subscriptions.model");
const transporter = require("../config/mail.config");

const contactController = {
  createContactUs: async (req, res) => {
    try {
      const { name, email, contactNo, subject, description } = req.body;
      const contact = await ContactModel.create({
        name,
        email,
        contactNo,
        subject,
        description,
      });

      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: subject || "Contact Request Received",
        text: "We have received your request and will get back to you soon.",
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        status: true,
        message: "Contact request submitted successfully",
        data: contact,
      });
    } catch (error) {
      console.error("Error while saving contact:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getAllContacts: async (req, res) => {
    try {
      let { offset = 0, limit = 10, search } = req.query;
      offset = parseInt(offset);
      limit = parseInt(limit);

      let filter = search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
            ],
          }
        : {};

      const { rows, count } = await ContactModel.findAndCountAll({
        where: filter,
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        status: true,
        contactsList: rows,
        totalContacts: count,
        message: "Contacts list fetched successfully",
      });
    } catch (error) {
      console.error("Error while fetching contacts:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getContactById: async (req, res) => {
    try {
      const contactData = await ContactModel.findByPk(req.params.id);
      if (!contactData) {
        return res.status(404).json({ status: false, message: "Contact not found" });
      }
      res.status(200).json({
        status: true,
        contactData,
        message: "Contact fetched successfully",
      });
    } catch (error) {
      console.error("Error getting contact data:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  removeContactUs: async (req, res) => {
    try {
      const deleted = await ContactModel.destroy({ where: { id: req.params.id } });
      if (!deleted) {
        return res.status(404).json({ status: false, message: "Contact not found" });
      }
      res.status(200).json({ status: true, message: "Contact deleted successfully" });
    } catch (error) {
      console.error("Error while deleting contact:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  subscriptionsRequest: async (req, res) => {
    try {
      const { email } = req.body;
      const existingEmail = await SubscriptionModel.findOne({ where: { subscriptionEmail: email } });

      if (existingEmail) {
        return res.status(409).json({ status: false, message: "You already have a subscription" });
      }

      await SubscriptionModel.create({ subscriptionEmail: email });

      res.status(201).json({ status: true, message: "Subscription request sent successfully" });
    } catch (error) {
      console.error("Error while saving subscription:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getAllSubscriptions: async (req, res) => {
    try {
      let { offset = 0, limit = 10, search } = req.query;
      offset = parseInt(offset);
      limit = parseInt(limit);

      let filter = search ? { subscriptionEmail: { [Op.like]: `%${search}%` } } : {};

      const { rows, count } = await SubscriptionModel.findAndCountAll({
        where: filter,
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        status: true,
        data: rows,
        totalCount: count,
        message: "Subscriptions list fetched successfully",
      });
    } catch (error) {
      console.error("Error while fetching subscriptions:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },
};

module.exports = contactController;
