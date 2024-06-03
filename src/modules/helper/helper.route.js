const express = require("express");
const { sendMessage } = require("./helper.controller");
const router = express.Router();

router.post("/send-message", sendMessage);

module.exports = { helperRoutes: router };
