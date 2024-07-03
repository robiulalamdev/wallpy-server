const express = require("express");
const {
  isAuth,
  isSetUser,
  isAuthenticated,
} = require("../../middlewares/auth");
const { getDashboardStats } = require("./analytics.controller");
const router = express.Router();

//* dashboard
router.get("/", getDashboardStats);

module.exports = { analyticsRoutes: router };
