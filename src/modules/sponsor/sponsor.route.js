const express = require("express");
const { isAuthenticated } = require("../../middlewares/auth");
const { ROLE_DATA } = require("../user/user.constants");
const {
  addSponsor,
  getMainSponsors,
  getMainSponsorsData,
  sponsorClickThrough,
  getOfficialWallpaperSponsors,
  getNewTrendingWallpaperSponsors,
  addSponsorForNewTrending,
  getOfficialSponsorData,
} = require("./sponsor.controller");
const router = express.Router();

router.post(
  "/create",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  addSponsor
);
router.post(
  "/create/new-trending",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  addSponsorForNewTrending
);

router.get(
  "/main",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getMainSponsors
);
router.get(
  "/official",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getOfficialWallpaperSponsors
);
router.get(
  "/new-trending",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getNewTrendingWallpaperSponsors
);

router.get("/public/main", getMainSponsorsData);
router.get("/public/official", getOfficialSponsorData);
router.post("/click-through/:id", sponsorClickThrough);

module.exports = { sponsorRoutes: router };
