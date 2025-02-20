const express = require("express");
const adminRouter = express.Router();
const upload = require("../middlewares/multer.middleware");
const userContactUsController = require("../controllers/contactUs.controller");
const faqsController = require("../controllers/faqs.controller");
const teamManagementController = require("../controllers/teamManagement.controller");
const cmsController = require("../controllers/cms.controller");
const portfolioController = require("../controllers/portfolio.controller");
const awardsAndCertificationsController = require("../controllers/awardsAndCertifications.controller");
const authController = require("../controllers/auth.controller");

adminRouter.get("/user/:id", authController.getUserById);
adminRouter.get("/contacts-list", userContactUsController.getAllContacts);
adminRouter.get("/contactus", userContactUsController.getContactById);
adminRouter.delete("/contactus/:id", userContactUsController.removeContactUs);
adminRouter.get("/subscriptions", userContactUsController.getAllSubscriptions);
adminRouter.post("/faqs", faqsController.createFaqs);
adminRouter.put("/faqs/:id", faqsController.updateFaqs);
adminRouter.delete("/faqs/:id", faqsController.deleteFaqs);
adminRouter.post("/team", teamManagementController.createTeamMember);
adminRouter.get("/team", teamManagementController.updateTeamMember);
adminRouter.delete("/team/:id", teamManagementController.removeTeamMember);
adminRouter.post("/manage-cms", cmsController.createCMS);
adminRouter.put("/manage-cms", cmsController.updateCMS);
adminRouter.post(
  "/portfolio",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  portfolioController.createPortfolio
);
adminRouter.put(
  "/portfolio",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  portfolioController.updatePortfolio
);
adminRouter.delete("/portfolio", portfolioController.deletePortfolio);
adminRouter.post(
  "/awards&certifications",
  upload.single("image"),
  awardsAndCertificationsController.create
);
adminRouter.put(
  "/awards&certifications",
  upload.single("image"),
  awardsAndCertificationsController.updateAward
);
adminRouter.delete(
  "/awards&certifications",
  awardsAndCertificationsController.removeAward
);
adminRouter.get(
  "/awards&certifications/:id",
  awardsAndCertificationsController.getAwardById
);
adminRouter.put("/update-user", authController.updateUser);

module.exports = adminRouter;
