const express = require("express");
const authRouter = require("./auth.routes");
const adminRouter = require("./admin.routes");
const userRouter = require("./user.routes");
const { authentication, authorize } = require("../middlewares/auth.middleware");
const { userRoles } = require("../helpers/constants");

const indexRouter = express.Router();

indexRouter.use("/auth", authRouter);
indexRouter.use("/user", userRouter);
indexRouter.use("/admin", authentication, authorize(userRoles.ADMIN), adminRouter);

module.exports = indexRouter;

