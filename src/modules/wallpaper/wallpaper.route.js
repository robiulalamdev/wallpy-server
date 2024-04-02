const express = require("express");
const {
  createWallpapers,
  getWallpapers,
  deleteWallpapersByIds,
  updateWallpapers,
  getWallpapersBySearch,
  getWallpaperBySlug,
} = require("./wallpaper.controller");
const { isAuth } = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const router = express.Router();

router.post(
  "/create-wallpapers",
  isAuth,
  upload.array("wallpaper", 6),
  handleMulterError,
  createWallpapers
);
router.get("/", isAuth, getWallpapers);
router.get("/public", getWallpapersBySearch);
router.get("/:slug", getWallpaperBySlug);
router.patch("/updates", isAuth, updateWallpapers);
router.delete("/deletes", isAuth, deleteWallpapersByIds);

module.exports = { wallpaperRoutes: router };
