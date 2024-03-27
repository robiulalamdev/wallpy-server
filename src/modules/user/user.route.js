const express = require("express");
const { createUser } = require("./user.controller");
const router = express.Router();

router.post("/signup", createUser);

module.exports = { userRoutes: router };
