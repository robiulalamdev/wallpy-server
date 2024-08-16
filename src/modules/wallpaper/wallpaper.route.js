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
  sponsorsWallpapers,
  getWallpapersByTag,
  getFeaturedItems,
  addFeaturedItems,
  getInfoBySlug,
  getTopThreeFavoritedWallpapers,
  getMostDownloadedWallpapers,
  addNewDownloadCountByWallId,
  getTopCategories,
  uploadSingleWallpaper,
} = require("./wallpaper.controller");
const {
  isAuth,
  isSetUser,
  isAuthenticated,
} = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const { ROLE_DATA } = require("../user/user.constants");
const router = express.Router();

router.post(
  "/create-wallpapers",
  isAuth,
  upload.array("wallpaper", 16),
  handleMulterError,
  createWallpapers
);
router.post(
  "/upload/single",
  isAuth,
  upload.single("file"),
  handleMulterError,
  uploadSingleWallpaper
);
router.get("/", isAuth, getWallpapers);
router.get("/profile-wallpapers/:userId", isSetUser, getWallpapersByUserId);
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
router.get("/tags/:tag", getWallpapersByTag);

// update
router.patch("/update-tags/:id", isAuth, updateWallpaperTag);
router.patch("/view-increment/:wallpaperId", addNewViewById);
router.patch("/download-inc/:wallpaperId", addNewDownloadCountByWallId);

//* dashboard
router.get("/sponsors", sponsorsWallpapers);
router.get(
  "/featured/items",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getFeaturedItems
);
router.post(
  "/add-media",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  upload.array("wallpaper", 16),
  handleMulterError,
  createWallpapers
);
router.patch(
  "/update-media-wallpaper",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  updateWallpapers
);
router.delete(
  "/deletes-media",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  deleteWallpapersByIds
);
router.patch(
  "/media/update-tags/:id",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  updateWallpaperTag
);
router.post(
  "/add-featured",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  addFeaturedItems
);
router.post(
  "/media-info/:slug",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getInfoBySlug
);
router.get(
  "/top-three/favorite",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getTopThreeFavoritedWallpapers
);
router.get(
  "/most-downloaded",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getMostDownloadedWallpapers
);
router.get(
  "/top-categories",
  // isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getTopCategories
);

module.exports = { wallpaperRoutes: router };
