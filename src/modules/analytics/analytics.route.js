const express = require("express");
const {
  isAuth,
  isSetUser,
  isAuthenticated,
} = require("../../middlewares/auth");
const { getDashboardStats } = require("./analytics.controller");
const { ROLE_DATA } = require("../user/user.constants");
const router = express.Router();

//* dashboard
router.get(
  "/",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getDashboardStats
);

module.exports = { analyticsRoutes: router };
