const express = require("express");
const {
  createWallpapers,
  getWallpapers,
  deleteWallpapersByIds,
  updateWallpapers,
  getWallpapersBySearch,
  getWallpaperBySlug,
  getWallpapersByUserId,
  getPopularWallpapers,
  getFeaturedWallpapers,
  getOfficialWallpapers,
  updateWallpaperTag,
} = require("./wallpaper.controller");
const { isAuth } = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const router = express.Router();

router.post(
  "/create-wallpapers",
  isAuth,
  upload.array("wallpaper", 16),
  handleMulterError,
  createWallpapers
);
router.get("/", isAuth, getWallpapers);
router.get("/profile-wallpapers/:userId", getWallpapersByUserId);
router.get("/public", getWallpapersBySearch);
router.get("/slug/:slug", getWallpaperBySlug);
router.patch("/updates", isAuth, updateWallpapers);
router.delete("/deletes", isAuth, deleteWallpapersByIds);
// get popular wallpapers
router.get("/popular", getPopularWallpapers);
router.get("/featured", getFeaturedWallpapers);
router.get("/official", getOfficialWallpapers);

// update
router.patch("/update-tags/:id", isAuth, updateWallpaperTag);

module.exports = { wallpaperRoutes: router };
