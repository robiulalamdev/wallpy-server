const express = require("express");

const { isAuth } = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const {
  verificationRequest,
  updateBrandTabInfo,
  approvedProfile,
} = require("./profile.controller");
const router = express.Router();

router.post(
  "/verification-request",
  isAuth,
  upload.single("proof_of_identity"),
  handleMulterError,
  verificationRequest
);

router.patch(
  "/update-brand-tab-info",
  isAuth,
  upload.single("official_banner"),
  handleMulterError,
  updateBrandTabInfo
);

router.patch("/approved-profile/:id", approvedProfile);

module.exports = { profileRoutes: router };
