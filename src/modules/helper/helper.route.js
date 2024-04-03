const express = require("express");
const { sendMessage } = require("./helper.conroller");
const router = express.Router();

router.post("/send-message", sendMessage);

module.exports = { helperRoutes: router };
