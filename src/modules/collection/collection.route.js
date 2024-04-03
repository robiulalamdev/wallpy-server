const express = require("express");
const { isAuth } = require("../../middlewares/auth");
const {
  createCollection,
  getMyCollections,
  updateMyCollections,
  removeMyCollections,
  getMyProfileCollections,
  getCollectionsList,
  addRemoveCollectionItem,
} = require("./collection.controller");
const router = express.Router();

router.post("/create", isAuth, createCollection);
router.get("/my-collections", isAuth, getMyCollections);
router.get("/my-profile-collections/:userId", getMyProfileCollections);
router.get("/list/:userId/:wallpaperId", getCollectionsList);
router.delete("/remove-my-collections", isAuth, removeMyCollections);
router.patch("/update-my-collections", isAuth, updateMyCollections);
router.post(
  "/add-remove-wallpaper/:collectionId",
  isAuth,
  addRemoveCollectionItem
);

module.exports = { collectionRoutes: router };
