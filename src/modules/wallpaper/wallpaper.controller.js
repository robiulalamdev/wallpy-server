const Profile = require("../profile/profile.model");
const User = require("../user/user.model");
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

const getWallpapersByUserId = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.params.userId);
    if (isExistUser) {
      const published = await Wallpaper.find({
        user: req.params.userId,
        status: WALLPAPER_ENUMS.STATUS[1],
      }).sort({ _id: -1 });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieve Successfully",
        data: published,
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

const getWallpaperBySlug = async (req, res) => {
  try {
    const result = await Wallpaper.findOne({
      slug: req.params?.slug,
      status: WALLPAPER_ENUMS.STATUS[1],
    });
    if (result) {
      const getAuthor = await User.findById({
        _id: result?.user?.toString(),
      }).select("name username verified");
      const profile = await Profile.findOne({
        user: result?.user?.toString(),
      }).select("profile_image");
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpaper Retrieve Successfully",
        data: {
          ...result?.toObject(),
          author_info: {
            ...getAuthor?.toObject(),
            profile_image: profile?.profile_image || null,
          },
        },
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Wallpaper Not Found",
        data: null,
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

// get search wallpapers with filter and pagination
const getWallpapersBySearch = async (req, res) => {
  try {
    let query = { status: WALLPAPER_ENUMS.STATUS[1] };

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { author: { $regex: searchRegex } },
        { source: { $regex: searchRegex } },
        { wallpaper: { $regex: searchRegex } },
        { screen_type: { $regex: searchRegex } },
        { classification: { $regex: searchRegex } },
        { type: { $regex: searchRegex } },
        { tags: { $elemMatch: { $regex: searchRegex } } },
      ];
    }

    if (req.query.type) {
      query["type"] = req.query.type;
    }
    if (req.query.author) {
      query["author"] = req.query.author;
    }
    if (req.query.source) {
      query["source"] = req.query.source;
    }
    if (req.query.wallpaper) {
      query["wallpaper"] = req.query.wallpaper;
    }
    if (req.query.wallpaper) {
      query["wallpaper"] = req.query.wallpaper;
    }
    if (req.query.screen_type) {
      query["screen_type"] = req.query.screen_type;
    }
    if (req.query.classification) {
      query["classification"] = req.query.classification;
    }

    let { page = 1, limit = 60, sortBy = "_id", sortOrder = "asc" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const total = await Wallpaper.countDocuments(query);
    const results = await Wallpaper.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Wallpapers Retrieved Successfully",
      data: {
        data: results,
        meta: {
          page,
          limit,
          total,
        },
      },
    });
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
  getWallpapersByUserId,
  deleteWallpapersByIds,
  updateWallpapers,
  getWallpapersBySearch,
  getWallpaperBySlug,
};
