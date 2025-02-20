const express = require('express')
const authController = require("../controllers/auth.controller");
const upload = require("../middlewares/multer.middleware");

const authRouter = express.Router();

authRouter.post("/register", upload.single("logo"), authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/reset-password", authController.resetPassword);

module.exports = authRouter;