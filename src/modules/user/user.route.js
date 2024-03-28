const express = require("express");
const { createUser, verifyEmail } = require("./user.controller");
const router = express.Router();

router.post("/signup", createUser);
router.post("/email-verify/:token", verifyEmail);

module.exports = { userRoutes: router };
