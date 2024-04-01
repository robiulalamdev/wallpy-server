const { getUserInfoById } = require("../user/user.service");
const { WALLPAPER_ENUMS } = require("./wallpaper.constant");
const Wallpaper = require("./wallpaper.model");
const { wallpapersMake } = require("./wallpaper.service");

const createWallpapers = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user._id);
    if (isExistUser) {
      if (isExistUser?.profile?.verification_status === "Approved") {
        if (req.files && req.files.length > 0) {
          const wallpapers = await wallpapersMake(
            req.files,
            isExistUser?._id?.toString()
          );
          if (wallpapers?.length > 0) {
            const result = await Wallpaper.insertMany(wallpapers);
            res.status(200).json({
              status: 200,
              success: true,
              message: "Wallpaper Created Successfully",
              data: result,
            });
          } else {
            res.status(400).json({
              status: 400,
              success: false,
              message: "No wallpapers uploaded",
            });
          }
        }
      } else {
        res.status(201).json({
          status: 201,
          success: false,
          type: "verification",
          message: "Profile Not Verified",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
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

const getWallpapers = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user._id);
    if (isExistUser) {
      const drafts = await Wallpaper.find({
        user: req.user._id,
        status: WALLPAPER_ENUMS.STATUS[0],
      }).sort({ _id: -1 });
      const published = await Wallpaper.find({
        user: req.user._id,
        status: WALLPAPER_ENUMS.STATUS[1],
      }).sort({ _id: -1 });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieve Successfully",
        data: { drafts: drafts, published: published },
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
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

const updateWallpapers = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user._id);
    if (isExistUser) {
      if (isExistUser?.profile?.verification_status === "Approved") {
        const result = await Wallpaper.updateMany(
          { _id: { $in: req.body?.ids }, user: req.user._id },
          {
            $set: req.body.updateData,
          },
          { new: false }
        );
        res.status(200).json({
          status: 200,
          success: true,
          message: "Wallpaper Created Successfully",
        });
      } else {
        res.status(201).json({
          status: 201,
          success: false,
          type: "verification",
          message: "Profile Not Verified",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
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

const deleteWallpapersByIds = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user._id);
    if (isExistUser) {
      if (isExistUser?.profile?.verification_status === "Approved") {
        const result = await Wallpaper.deleteMany({
          _id: { $in: req.body.ids },
          user: req.user._id,
        });
        res.status(200).json({
          status: 200,
          success: true,
          message: "Wallpaper Created Successfully",
          data: result,
        });
      } else {
        res.status(201).json({
          status: 201,
          success: false,
          type: "verification",
          message: "Profile Not Verified",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User Not Found!",
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
  createWallpapers,
  getWallpapers,
  deleteWallpapersByIds,
  updateWallpapers,
};
