const express = require("express");
const { createUser, verifyEmail, loginUser } = require("./user.controller");
const router = express.Router();

router.post("/signup", createUser);
router.post("/email-verify/:token", verifyEmail);
router.post("/login", loginUser);

module.exports = { userRoutes: router };
