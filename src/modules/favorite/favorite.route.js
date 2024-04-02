const express = require("express");
const {
  createFavoriteWithToggle,
  getMyFavorites,
  removeMyFavorites,
  updateMyFavorites,
} = require("./favorite.controller");
const { isAuth } = require("../../middlewares/auth");
const router = express.Router();

router.post("/add-to-favorite", isAuth, createFavoriteWithToggle);
router.get("/my-favorites", isAuth, getMyFavorites);
router.delete("/remove-my-favorites", isAuth, removeMyFavorites);
router.patch("/update-my-favorites", isAuth, updateMyFavorites);

module.exports = { favoriteRoutes: router };
