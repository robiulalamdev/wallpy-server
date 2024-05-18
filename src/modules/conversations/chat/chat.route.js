const express = require("express");
const { createChat, getAllChats } = require("./chat.controller");
const { isAuth } = require("../../../middlewares/auth");
const router = express.Router();

router.post("/create", isAuth, createChat);
router.get("/me", isAuth, getAllChats);
router.get("/members/receiverId/:senderId");

module.exports = { chatRoutes: router };
