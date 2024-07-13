const express = require("express");
const {
  createVerificationRequest,
  getVerifications,
  getReviewedVerifications,
  modifyVerificationRequest,
} = require("./verification.controller");
const { upload, handleMulterError } = require("../../config/multer");
const { isAuth, isAuthenticated } = require("../../middlewares/auth");
const { ROLE_DATA } = require("../user/user.constants");
const router = express.Router();

router.post(
  "/create",
  isAuth,
  upload.single("proof_of_identity"),
  handleMulterError,
  createVerificationRequest
);
router.get(
  "/",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getVerifications
);
router.get(
  "/reviewed",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getReviewedVerifications
);

router.patch(
  "/modify/:id",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  modifyVerificationRequest
);

module.exports = { verificationRoutes: router };
