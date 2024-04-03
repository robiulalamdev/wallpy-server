const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const {
  createCollection,
  getMyCollections,
  updateMyCollections,
  removeMyCollections,
  getMyProfileCollections,
  getCollectionsList,
} = require("./collection.controller");
const router = express.Router();

router.post("/create", isAuth, createCollection);
router.get("/my-collections", isAuth, getMyCollections);
router.get("/my-profile-collections/:userId", getMyProfileCollections);
router.get("/list/:userId", getCollectionsList);
router.delete("/remove-my-collections", isAuth, removeMyCollections);
router.patch("/update-my-collections", isAuth, updateMyCollections);

module.exports = { collectionRoutes: router };
