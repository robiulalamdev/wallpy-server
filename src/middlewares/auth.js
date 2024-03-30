require("dotenv").config();
const jwt = require("jsonwebtoken");
const VARIABLES = require("../config");
const { getUserByUsername } = require("../modules/user/user.service");

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, VARIABLES.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: 401,
          success: false,
          message: "Forbidden Access",
        });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(401).json({
      status: 401,
      success: false,
      message: err.message,
    });
  }
};

const isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, VARIABLES.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          status: 401,
          success: false,
          message: "Forbidden Access",
        });
      }
      if (decoded.role === "Admin") {
        req.user = decoded;
        next();
      } else {
        return res.status(403).json({
          status: 401,
          success: false,
          message: "Forbidden Access",
        });
      }
    });
  } catch (err) {
    res.status(401).json({
      status: 401,
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  isAuth,
  isAdmin,
};
