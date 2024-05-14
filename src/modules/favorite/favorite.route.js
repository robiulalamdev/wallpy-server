const express = require("express");
const {
  createFavoriteWithToggle,
  getMyFavorites,
  removeMyFavorites,
  updateMyFavorites,
  getMyProfileFavorites,
  getTotalFavorites,
} = require("./favorite.controller");
const { isAuth } = require("../../middlewares/auth");
const router = express.Router();

router.post("/add-to-favorite", isAuth, createFavoriteWithToggle);
router.get("/my-favorites", isAuth, getMyFavorites);
router.get("/my-profile-favorites/:id", getMyProfileFavorites);
router.delete("/remove-my-favorites", isAuth, removeMyFavorites);
router.patch("/update-my-favorites", isAuth, updateMyFavorites);

// get total favorites count
router.get("/total/:id", getTotalFavorites);

module.exports = { favoriteRoutes: router };
