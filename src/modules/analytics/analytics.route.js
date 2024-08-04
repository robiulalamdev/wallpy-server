const express = require("express");
const { isAuthenticated } = require("../../middlewares/auth");
const {
  getDashboardStats,
  handleTrackingVisitor,
} = require("./analytics.controller");
const { ROLE_DATA } = require("../user/user.constants");
const router = express.Router();

router.post("/tracking", handleTrackingVisitor);
//* dashboard
router.get(
  "/",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getDashboardStats
);

module.exports = { analyticsRoutes: router };
