const { sendContactMessage } = require("../../helpers/sendEmailHelper");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sendMessage = async (req, res) => {
  try {
    const result = await sendContactMessage(req.body);
    if (result) {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Message Send Success",
        data: result,
      });
    } else {
      res.status(201).json({
        status: 201,
        success: false,
        message: "Message Send Failed",
      });
    }
  } catch (error) {
    res.status(201).json({
      status: false,
      error_message: error.message,
      message: "Message Send Failed",
    });
  }
};

const getResizeImage = async (req, res) => {
  const { path: fullImagePath, width, height } = req.query;
  if (!fullImagePath) {
    return res.status(400).send("Missing required query parameters: path");
  }

  if (!fs.existsSync(fullImagePath)) {
    return res.status(404).send("Image not found");
  }

  try {
    const imageMetadata = await sharp(fullImagePath).metadata();
    const widthInt = width ? parseInt(width) : imageMetadata?.width;
    const heightInt = height ? parseInt(height) : imageMetadata?.height;

    const resizeOptions = {
      width: widthInt,
      height: heightInt,
      fit: sharp.fit.inside,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    };

    if (req.query?.fit === "cover") {
      resizeOptions["fit"] = "cover";
    } else if (req.query?.fit === "contain") {
      resizeOptions["fit"] = "inside";
    } else if (req.query?.fit === "fill") {
      resizeOptions["fit"] = "fill";
    }

    const resizedImage = await sharp(fullImagePath)
      .resize(resizeOptions)
      .toBuffer();

    res.type(`image/${imageMetadata?.format || "jpeg"}`).send(resizedImage);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing image");
  }
};

// upload image
const uploadFile = async (req, res) => {
  try {
    if (req.file) {
      res.status(200).json({
        success: true,
        data: req.file?.path,
        message: "upload successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        data: null,
        message: "upload unSuccessfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error_message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getResizeImage,
  uploadFile,
};
