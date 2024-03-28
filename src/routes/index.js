const express = require("express");
const { userRoutes } = require("../modules/user/user.route");
const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
module.exports = { routers: router };
