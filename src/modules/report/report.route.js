const express = require("express");
const { sendReport } = require("./report.controller");
const { isAuth } = require("../../middlewares/auth");
const router = express.Router();

router.post("/create", isAuth, sendReport);

module.exports = { reportRoutes: router };
