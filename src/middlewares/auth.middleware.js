const registerModel = require("../models/auth.register.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = async (req, res, next) => {
  try {
    let token = req.header(process.env.JWT_TOKEN_HEADER || "Authorization");
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    console.log("Token received:", token);

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    const user = await registerModel.findOne({ email: tokenData.email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const authorize = (roleName) => {
  return (req, res, next) => {
    if (req.user && req.user.role === roleName) {
      console.log(`Authorized as ${roleName}`);
      return next();
    } else {
      return res.status(403).json({ message: "User is not authorized" });
    }
  };
};

module.exports = { authentication, authorize };
