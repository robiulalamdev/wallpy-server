const express = require("express");
const { getAllMessagesByChat, createMessage } = require("./message.controller");
const { isAuth } = require("../../../middlewares/auth");
const router = express.Router();

router.post("/create", isAuth, createMessage);
router.get("/:chatId", isAuth, getAllMessagesByChat);

module.exports = { messageRoutes: router };
