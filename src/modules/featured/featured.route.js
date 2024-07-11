const express = require("express");
const {
  isAuth,
  isSetUser,
  isAuthenticated,
} = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const { ROLE_DATA } = require("../user/user.constants");
const {
  addFeatured,
  getContactFeatured,
  getFeaturedData,
  getStaffFeatured,
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

module.exports = { featuredRoutes: router };
