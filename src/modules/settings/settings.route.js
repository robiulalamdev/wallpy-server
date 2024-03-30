const express = require("express");

const { isAuth } = require("../../middlewares/auth");
const { updateSettings } = require("./settings.controller");
const router = express.Router();

router.patch("/change", isAuth, updateSettings);

module.exports = { settingsRoutes: router };
