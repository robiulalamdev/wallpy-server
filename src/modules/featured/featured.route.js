const express = require("express");
const { isAuthenticated } = require("../../middlewares/auth");
const { ROLE_DATA } = require("../user/user.constants");
const {
  addFeatured,
  getContactFeatured,
  getFeaturedData,
  getStaffFeatured,
  getCredentialsFeatured,
} = require("./featured.controller");
const router = express.Router();

router.post(
  "/create",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  addFeatured
);
router.get("/", getFeaturedData);

router.get(
  "/contact",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getContactFeatured
);
router.get(
  "/staff",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getStaffFeatured
);
router.get(
  "/credentials",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getCredentialsFeatured
);

module.exports = { featuredRoutes: router };
