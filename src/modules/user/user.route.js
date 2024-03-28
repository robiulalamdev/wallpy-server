const express = require("express");
const {
  createUser,
  verifyEmail,
  loginUser,
  resetPassword,
  verifyResetPasswordToken,
  changePassword,
} = require("./user.controller");
const router = express.Router();

router.post("/signup", createUser);
router.post("/email-verify/:token", verifyEmail);
router.post("/login", loginUser);

// reset password with email
router.post("/reset-password", resetPassword);
router.post("/verify-reset-password/:token", verifyResetPasswordToken);
router.post("/change-password/", changePassword);

module.exports = { userRoutes: router };
