const express = require("express");
const { userRoutes } = require("../modules/user/user.route");
const { settingsRoutes } = require("../modules/settings/settings.route");
const { profileRoutes } = require("../modules/profile/profile.route");
const { wallpaperRoutes } = require("../modules/wallpaper/wallpaper.route");
const { favoriteRoutes } = require("../modules/favorite/favorite.route");
const { collectionRoutes } = require("../modules/collection/collection.route");
const { helperRoutes } = require("../modules/helper/helper.route");
const { reportRoutes } = require("../modules/report/report.route");
const { chatRoutes } = require("../modules/conversations/chat/chat.route");
const {
  messageRoutes,
} = require("../modules/conversations/message/message.route");
const { featuredRoutes } = require("../modules/featured/featured.route");
const { analyticsRoutes } = require("../modules/analytics/analytics.route");
const { damMessageRoutes } = require("../modules/damMessage/damMessage.route");
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
  {
    path: "/helpers",
    route: helperRoutes,
  },
  {
    path: "/reports",
    route: reportRoutes,
  },
  {
    path: "/chats",
    route: chatRoutes,
  },
  {
    path: "/messages",
    route: messageRoutes,
  },
  {
    path: "/featured",
    route: featuredRoutes,
  },
  {
    path: "/analytics",
    route: analyticsRoutes,
  },
  {
    path: "/dam-messages",
    route: damMessageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = { routers: router };
