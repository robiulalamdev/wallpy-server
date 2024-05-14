const express = require("express");
const {
  createUser,
  verifyEmail,
  loginUser,
  resetPassword,
  verifyResetPasswordToken,
  changePassword,
  updatePassword,
  getUserInfo,
  updateProfileTabInfo,
  updateCredentialsTabInfo,
  getPublicUserInfo,
  getAllUsers,
} = require("./user.controller");
const { isAuth } = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const router = express.Router();

router.post("/signup", createUser);
router.post("/email-verify/:token", verifyEmail);
router.post("/login", loginUser);
router.get("/me", isAuth, getUserInfo);
router.get("/profile/:username", getPublicUserInfo);

// reset password with email
router.post("/reset-password", resetPassword);
router.post("/verify-reset-password/:token", verifyResetPasswordToken);
router.post("/change-password/", changePassword);

// change password with auth token after login
router.patch("/update-password/", isAuth, updatePassword);

// update endpoints
router.patch(
  "/update-profile-tab",
  isAuth,
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  handleMulterError,
  updateProfileTabInfo
);
router.patch("/update-credentials-tab", isAuth, updateCredentialsTabInfo);
router.get("/all", getAllUsers);

module.exports = { userRoutes: router };
