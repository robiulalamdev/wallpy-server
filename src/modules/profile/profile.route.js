const express = require("express");

const { isAuth, isAuthenticated } = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const {
  verificationRequest,
  updateBrandTabInfo,
  approvedProfile,
  updateProfileSetting,
  modifyProfileInformation,
} = require("./profile.controller");
const { ROLE_DATA } = require("../user/user.constants");
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

router.patch(
  "/modify/profile-settings/:id",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  handleMulterError,
  updateProfileSetting
);

router.patch(
  "/modify/profile-information/:id",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  modifyProfileInformation
);

router.patch("/approved-profile/:id", approvedProfile);

module.exports = { profileRoutes: router };
