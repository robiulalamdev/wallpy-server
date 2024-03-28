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
} = require("./user.controller");
const { isAuth } = require("../../middlewares/auth");
const router = express.Router();

router.post("/signup", createUser);
router.post("/email-verify/:token", verifyEmail);
router.post("/login", loginUser);
router.get("/me", isAuth, getUserInfo);

// reset password with email
router.post("/reset-password", resetPassword);
router.post("/verify-reset-password/:token", verifyResetPasswordToken);
router.post("/change-password/", changePassword);

// change password with auth token after login
router.patch("/update-password/", isAuth, updatePassword);

module.exports = { userRoutes: router };
