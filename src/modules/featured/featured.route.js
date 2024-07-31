const express = require("express");
const { isAuthenticated } = require("../../middlewares/auth");
const { ROLE_DATA } = require("../user/user.constants");
const {
  addFeatured,
  getContactFeatured,
  getFeaturedData,
  getStaffFeatured,
  getCredentialsFeatured,
  getArtistsFeatured,
  getArtistsFeaturedData,
  getFeaturedWallpapers,
} = require("./featured.controller");
const router = express.Router();

router.post(
  "/create",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  addFeatured
);
router.get("/", getFeaturedData);

router.get(
  "/wallpaper",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getFeaturedWallpapers
);
router.get("/public/artists", getArtistsFeaturedData);

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

router.get(
  "/artists",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getArtistsFeatured
);

module.exports = { featuredRoutes: router };
