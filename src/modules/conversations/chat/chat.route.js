const express = require("express");
const {
  createChat,
  getAllChats,
  removeChatById,
} = require("./chat.controller");
const { isAuth } = require("../../../middlewares/auth");
const router = express.Router();

router.post("/create", isAuth, createChat);
router.get("/me", isAuth, getAllChats);
// router.get("/members/receiverId/:senderId");
router.delete("/:id", isAuth, removeChatById);

module.exports = { chatRoutes: router };
