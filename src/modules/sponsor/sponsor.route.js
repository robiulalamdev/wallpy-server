const express = require("express");
const { isAuthenticated } = require("../../middlewares/auth");
const { ROLE_DATA } = require("../user/user.constants");
const {
  addSponsor,
  getMainSponsors,
  getMainSponsorsData,
  sponsorClickThrough,
} = require("./sponsor.controller");
const router = express.Router();

router.post(
  "/create",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  addSponsor
);

router.get(
  "/main",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getMainSponsors
);
router.get("/public/main", getMainSponsorsData);
router.post("/click-through/:id", sponsorClickThrough);

module.exports = { sponsorRoutes: router };
