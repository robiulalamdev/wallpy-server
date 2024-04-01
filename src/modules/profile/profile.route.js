const express = require("express");

const { isAuth } = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const {
  verificationRequest,
  updateBrandTabInfo,
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

module.exports = { profileRoutes: router };
