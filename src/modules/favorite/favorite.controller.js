const { getUserById } = require("../user/user.service");
const { WALLPAPER_ENUMS } = require("../wallpaper/wallpaper.constant");
const Wallpaper = require("../wallpaper/wallpaper.model");
const Favorite = require("./favorite.model");

const createFavoriteWithToggle = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.user._id);
    if (isExistUser) {
      const isExist = await Wallpaper.findOne({
        _id: req.body.id,
        status: WALLPAPER_ENUMS.STATUS[1],
      });
      if (isExist) {
        const alreadyExist = await Favorite.findOne({
          user: isExistUser?._id.toString(),
          wallpaper: req.body.id,
        });
        if (alreadyExist) {
          const removeResult = await Favorite.deleteOne({
            user: isExistUser?._id.toString(),
            wallpaper: req.body.id,
          });
          res.status(200).json({
            status: 200,
            success: true,
            message: "Favorite is Removed",
          });
        } else {
          const newFavorite = new Favorite({
            user: isExistUser?._id.toString(),
            wallpaper: req.body.id,
          });
          const result = await newFavorite.save();
          res.status(200).json({
            status: 200,
            success: true,
            message: "Add to Favorite Success",
          });
        }
      } else {
        return res.status(404).json({
          status: 404,
          success: false,
          type: "wallpaper",
          message: "Data Not Found!",
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

const getMyFavorites = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.user._id);
    if (isExistUser) {
      const result = await Favorite.find({
        user: isExistUser?._id?.toString(),
      })
        .populate("wallpaper")
        .sort({ _id: -1 });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Favorites Retrieve Success",
        data: result,
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

const getMyProfileFavorites = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.params.id);
    if (isExistUser) {
      const result = await Favorite.find({
        user: isExistUser?._id?.toString(),
        status: true,
      })
        .populate("wallpaper")
        .sort({ _id: -1 });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Favorites Retrieve Success",
        data: result,
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

const getTotalFavorites = async (req, res) => {
  try {
    const isExist = await Wallpaper({ _id: req.params.id });
    if (isExist) {
      const result = await Favorite.countDocuments({
        wallpaper: req.params.id,
      });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Favorites Retrieve Success",
        total: result,
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        message: "Wallpaper Not Found!",
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

const removeMyFavorites = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.user._id);
    if (isExistUser) {
      const result = await Favorite.deleteMany({
        _id: { $in: req.body.ids },
        user: req.user._id,
      });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Favorites Removed Success",
        data: result,
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
const updateMyFavorites = async (req, res) => {
  try {
    const isExistUser = await getUserById(req.user._id);
    if (isExistUser) {
      const result = await Favorite.updateMany(
        {
          _id: { $in: req.body.ids },
          user: req.user._id,
        },
        { $set: req.body?.updateData }
      );
      res.status(200).json({
        status: 200,
        success: true,
        message: "Favorites Update Success",
        data: result,
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

module.exports = {
  createFavoriteWithToggle,
  getMyFavorites,
  removeMyFavorites,
  updateMyFavorites,
  getMyProfileFavorites,
  getTotalFavorites,
};
