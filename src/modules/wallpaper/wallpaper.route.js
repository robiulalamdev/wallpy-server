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
  addNewViewById,
  getSearchAndFilterWallpapers,
  getPopularTags,
  getResizeImage,
} = require("./wallpaper.controller");
const { isAuth, isSetUser } = require("../../middlewares/auth");
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
router.get("/public", isSetUser, getWallpapersBySearch);
router.get("/search-all", isSetUser, getSearchAndFilterWallpapers);
router.get("/slug/:slug", isSetUser, getWallpaperBySlug);
router.patch("/updates", isAuth, updateWallpapers);
router.delete("/deletes", isAuth, deleteWallpapersByIds);
// get popular wallpapers
router.get("/popular", isSetUser, getPopularWallpapers);
router.get("/featured", getFeaturedWallpapers);
router.get("/official", getOfficialWallpapers);
router.get("/popular-tags", getPopularTags);

// update
router.patch("/update-tags/:id", isAuth, updateWallpaperTag);
router.patch("/view-increment/:wallpaperId", addNewViewById);

// resize image when loading image
router.get("/resize", getResizeImage);

module.exports = { wallpaperRoutes: router };
