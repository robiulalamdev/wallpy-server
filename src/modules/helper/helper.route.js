const express = require("express");
const { sendMessage, uploadFile } = require("./helper.controller");
const { upload, handleMulterError } = require("../../config/multer");
const router = express.Router();

router.post("/send-message", sendMessage);
router.post(
  "/upload/single",
  upload.single("file"),
  handleMulterError,
  uploadFile
);

module.exports = { helperRoutes: router };
