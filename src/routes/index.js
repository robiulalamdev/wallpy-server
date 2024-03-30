const express = require("express");
const { userRoutes } = require("../modules/user/user.route");
const { settingsRoutes } = require("../modules/settings/settings.route");
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = { routers: router };
