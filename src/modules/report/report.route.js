const express = require("express");
const {
  sendReport,
  getUserReports,
  getRemovalRequests,
  getClaimRequests,
  getReviewedReports,
  modifyReport,
  getTotalReports,
} = require("./report.controller");
const { isAuth, isAuthenticated } = require("../../middlewares/auth");
const { ROLE_DATA } = require("../user/user.constants");
const router = express.Router();

router.post("/create", isAuth, sendReport);
router.patch(
  "/modify/:id",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  modifyReport
);

router.get(
  "/user-reports",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getUserReports
);
router.get(
  "/removal-requests",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getRemovalRequests
);
router.get(
  "/claim-requests",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getClaimRequests
);
router.get(
  "/reviewed",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getReviewedReports
);
router.get(
  "/total",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getTotalReports
);

module.exports = { reportRoutes: router };
