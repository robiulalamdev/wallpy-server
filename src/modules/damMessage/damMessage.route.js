const express = require("express");
const {
  isAuth,
  isSetUser,
  isAuthenticated,
} = require("../../middlewares/auth");
const { ROLE_DATA } = require("../user/user.constants");
const {
  getAllDamMessages,
  createDamMessage,
  clearDamMessages,
} = require("./damMessage.controller");
const router = express.Router();

router.post(
  "/create",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  createDamMessage
);

router.post("/remove", isAuthenticated([ROLE_DATA.ADMIN]), clearDamMessages);
router.get(
  "/",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getAllDamMessages
);

module.exports = { damMessageRoutes: router };
