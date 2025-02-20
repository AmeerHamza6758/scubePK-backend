const express = require("express");
const userRouter = express.Router();
const faqsController = require("../controllers/faqs.controller");
const userContactUsController = require("../controllers/contactUs.controller");
const cmsController = require("../controllers/cms.controller");
const teamManagementController = require("../controllers/teamManagement.controller");
const portfolioController = require('../controllers/portfolio.controller')
const awardsAndCertificationsController = require("../controllers/awardsAndCertifications.controller");

// userRouter.get()
userRouter.post("/users", userContactUsController.createContactUs);
userRouter.post("/users", userContactUsController.subscriptionsRequest);
userRouter.get("/faqs", faqsController.getAllFaqs);
userRouter.get("/team", teamManagementController.getAllTeamMembers);
userRouter.get("/manage-cms", cmsController.getCMS);
userRouter.get("/portfolio",portfolioController.getAllPortfolio)
userRouter.get('awards&certifications',awardsAndCertificationsController.getAll)
module.exports = userRouter;
