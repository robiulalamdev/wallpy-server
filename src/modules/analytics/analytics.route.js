const express = require("express");
const { isAuthenticated } = require("../../middlewares/auth");
const {
  getDashboardStats,
  handleTrackingVisitor,
} = require("./analytics.controller");
const { ROLE_DATA } = require("../user/user.constants");
const { trackingVisitor } = require("./analytics.service");
const { getLocation } = require("../../helpers/services");
const router = express.Router();

router.post("/tracking", handleTrackingVisitor);
//* dashboard
router.get(
  "/",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getDashboardStats
);

router.get("/ip", async (req, res) => {
  const ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "";
  const result = await getLocation(ip);
  res.status(200).json({
    message: "IP tracking successful",
    data: result,
    ip: ip,
  });
});

module.exports = { analyticsRoutes: router };
