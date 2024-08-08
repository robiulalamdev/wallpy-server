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
  getFeaturedCredentialData,
} = require("./featured.controller");
const router = express.Router();

router.post(
  "/create",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  addFeatured
);
router.get("/", getFeaturedData);
router.get("/public/credentials/login", getFeaturedCredentialData);
router.get("/public/credentials/signup", getFeaturedCredentialData);
router.get("/public/credentials/signup-cnf", getFeaturedCredentialData);
router.get("/public/credentials/ev", getFeaturedCredentialData);
router.get("/public/credentials/pcs", getFeaturedCredentialData);
router.get("/public/credentials/fp", getFeaturedCredentialData);
router.get("/public/credentials/fe", getFeaturedCredentialData);
router.get("/public/credentials/rp", getFeaturedCredentialData);
router.get("/public/credentials/np", getFeaturedCredentialData);

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
