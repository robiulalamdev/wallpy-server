const express = require("express");
const { userRoutes } = require("../modules/user/user.route");
const { settingsRoutes } = require("../modules/settings/settings.route");
const { profileRoutes } = require("../modules/profile/profile.route");
const { wallpaperRoutes } = require("../modules/wallpaper/wallpaper.route");
const { favoriteRoutes } = require("../modules/favorite/favorite.route");
const { collectionRoutes } = require("../modules/collection/collection.route");
const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/users/settings",
    route: settingsRoutes,
  },
  {
    path: "/users/profiles",
    route: profileRoutes,
  },
  {
    path: "/wallpapers",
    route: wallpaperRoutes,
  },
  {
    path: "/favorites",
    route: favoriteRoutes,
  },
  {
    path: "/collections",
    route: collectionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = { routers: router };
