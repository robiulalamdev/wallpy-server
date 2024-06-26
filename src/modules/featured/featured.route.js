const express = require("express");
const {
  isAuth,
  isSetUser,
  isAuthenticated,
} = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const { ROLE_DATA } = require("../user/user.constants");
const { addFeatured, getContactFeatured } = require("./featured.controller");
const router = express.Router();

router.post(
  "/create",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  addFeatured
);
router.get(
  "/contact",
  // isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getContactFeatured
);

module.exports = { featuredRoutes: router };
