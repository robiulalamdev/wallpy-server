const Favorite = require("../favorite/favorite.model");
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
      }).select("profile_image verification_status name profile_type");

      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpaper Retrieve Successfully",
        data: {
          ...result?.toObject(),
          author_info: {
            ...getAuthor?.toObject(),
            profile_image: profile?.profile_image || null,
            verification_status:
              profile.verification_status === "Approved" ? true : false,
            name: profile?.name,
            profile_type: profile?.profile_type,
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

    if (req.query.type && req.query.type.toLowerCase() !== "all") {
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

    let {
      page = 1,
      limit = 60,
      sortBy = "createdAt",
      sortOrder = "desc",
      tn = "trending",
    } = req.query;

    let sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    page = parseInt(page);
    limit = parseInt(limit);

    if (tn?.toLowerCase() === "trending") {
      const favoritesCounts = await Favorite.aggregate([
        { $match: {} },
        { $group: { _id: "$wallpaper", count: { $sum: 1 } } },
      ]);

      const wallpaperFavoritesMap = favoritesCounts.reduce((acc, favorite) => {
        acc[favorite._id] = favorite.count;
        return acc;
      }, {});

      const wallpapers = await Wallpaper.find(query);

      const sortedWallpapers = wallpapers.sort((a, b) => {
        const aFavorites = wallpaperFavoritesMap[a._id] || 0;
        const bFavorites = wallpaperFavoritesMap[b._id] || 0;
        const aScore = a.view + aFavorites;
        const bScore = b.view + bFavorites;
        return sortOrder.toLowerCase() === "asc"
          ? aScore - bScore
          : bScore - aScore;
      });

      const total = sortedWallpapers.length;
      const paginatedResults = sortedWallpapers.slice(
        (page - 1) * limit,
        page * limit
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieved Successfully",
        data: {
          data: paginatedResults,
          meta: {
            page,
            limit,
            total,
          },
        },
      });
    } else if (tn?.toLowerCase() === "new") {
      sort["createdAt"] = -1; // Newest first
    }

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

const updateWallpaperTag = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user._id);
    if (isExistUser) {
      const result = await Wallpaper.updateOne(
        { _id: req.params.id },
        // { _id: req.params.id, user: req.user._id },
        {
          $set: req.body,
        },
        { new: false }
      );
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpaper Created Successfully",
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

const deleteWallpapersByIds = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user._id);
    if (isExistUser) {
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

const getPopularWallpapers = async (req, res) => {
  try {
    const popularWallpapers = await Favorite.aggregate([
      {
        $group: {
          _id: "$wallpaper",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: parseInt(req.query?.limit) || 20,
      },
    ]);

    const ids = popularWallpapers.map((entry) => entry._id);
    const result = await Wallpaper.find({
      _id: { $in: ids },
      status: WALLPAPER_ENUMS.STATUS[1],
    });
    res.status(200).json({
      status: 200,
      success: false,
      message: "Wallpapers Retrieve Success",
      data: result,
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

const getFeaturedWallpapers = async (req, res) => {
  try {
    const result = await Wallpaper.find({
      status: WALLPAPER_ENUMS.STATUS[1],
    })
      .sort({ _id: -1 })
      .limit(parseInt(req.query?.limit) || 20);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Wallpaper Retrieve Successfully",
      data: result,
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

const getOfficialWallpapers = async (req, res) => {
  try {
    const profiles = await Profile.find({}).sort({ _id: -1 }).limit(50);
    const ids = await profiles?.map((pro) => pro?.user);
    const result = await Wallpaper.find({
      user: { $in: ids },
      status: WALLPAPER_ENUMS.STATUS[1],
    })
      .sort({ _id: -1 })
      .limit(parseInt(req.query?.limit) || 20);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Wallpaper Retrieve Successfully",
      data: result,
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

const addNewViewById = async (req, res) => {
  try {
    const result = await Wallpaper.updateOne(
      { _id: req.params.wallpaperId },
      { $inc: { view: 1 } }
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Wallpaper View Successfully",
      data: result,
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

// get search wallpapers with filter and pagination

const getSearchAndFilterWallpapers = async (req, res) => {
  try {
    let query = { status: WALLPAPER_ENUMS.STATUS[1] };

    // Text search
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

    // Filters
    if (req.query.type && req.query.type.toLowerCase() !== "all") {
      query["type"] = { $regex: new RegExp(req.query.type, "i") };
    }
    if (req.query.author) {
      query["author"] = { $regex: new RegExp(req.query.author, "i") };
    }
    if (req.query.source) {
      query["source"] = { $regex: new RegExp(req.query.source, "i") };
    }
    if (req.query.wallpaper) {
      query["wallpaper"] = { $regex: new RegExp(req.query.wallpaper, "i") };
    }
    if (req.query.screen_type) {
      query["screen_type"] = { $regex: new RegExp(req.query.screen_type, "i") };
    }
    if (req.query.classification) {
      query["classification"] = {
        $regex: new RegExp(req.query.classification, "i"),
      };
    }
    if (req.query.width) {
      query["dimensions.width"] = parseInt(req.query.width);
    }
    if (req.query.height) {
      query["dimensions.height"] = parseInt(req.query.height);
    }

    // Date filters
    const currentDate = new Date();
    let startDate;

    if (req.query.date) {
      switch (req.query.date.toLowerCase()) {
        case "today":
          startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
          endDate = currentDate; // Current date/time
          break;
        case "this week":
          startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
          endDate = currentDate; // Current date/time
          break;
        case "this month":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - 30
          ); // Last 30 days
          endDate = currentDate; // Current date/time
          break;
        case "this year":
          startDate = new Date(
            currentDate.getFullYear() - 1,
            currentDate.getMonth(),
            currentDate.getDate()
          ); // Last 1 year
          endDate = currentDate; // Current date/time
          break;
        case "all time":
          startDate = new Date(0); // Unix epoch start date
          endDate = currentDate; // Current date/time
          break;
        default:
          startDate = new Date(0); // Default to all time if unknown value
          endDate = currentDate; // Current date/time
      }

      query["createdAt"] = { $gte: startDate, $lte: endDate };
    }

    // Pagination
    let {
      page = 1,
      limit = 60,
      sort_by = "",
      sortOrder = "desc",
      tn = "trending",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let sort = {};

    // Sorting logic for tn and sort_by

    if (tn?.toLowerCase() === "trending") {
      const favoritesCounts = await Favorite.aggregate([
        { $match: {} },
        { $group: { _id: "$wallpaper", count: { $sum: 1 } } },
      ]);

      const wallpaperFavoritesMap = favoritesCounts.reduce((acc, favorite) => {
        acc[favorite._id] = favorite.count;
        return acc;
      }, {});

      const wallpapers = await Wallpaper.find(query);

      const sortedWallpapers = wallpapers.sort((a, b) => {
        const aFavorites = wallpaperFavoritesMap[a._id] || 0;
        const bFavorites = wallpaperFavoritesMap[b._id] || 0;
        const aScore = a.view + aFavorites;
        const bScore = b.view + bFavorites;
        return sortOrder.toLowerCase() === "asc"
          ? aScore - bScore
          : bScore - aScore;
      });

      const total = sortedWallpapers.length;
      const paginatedResults = sortedWallpapers.slice(
        (page - 1) * limit,
        page * limit
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieved Successfully",
        data: {
          data: paginatedResults,
          meta: {
            page,
            limit,
            total,
          },
        },
      });
    } else if (tn?.toLowerCase() === "new") {
      sort["createdAt"] = -1; // Newest first
    }

    if (sort_by?.toLowerCase() === "views") {
      sort["view"] = sortOrder.toLowerCase() === "asc" ? 1 : -1;
    } else if (sort_by?.toLowerCase() === "favorites") {
      const favoritesCounts = await Favorite.aggregate([
        { $match: {} },
        { $group: { _id: "$wallpaper", count: { $sum: 1 } } },
      ]);

      const wallpaperFavoritesMap = favoritesCounts.reduce((acc, favorite) => {
        acc[favorite._id] = favorite.count;
        return acc;
      }, {});

      const wallpapers = await Wallpaper.find(query);

      const sortedWallpapers = wallpapers.sort((a, b) => {
        const aFavorites = wallpaperFavoritesMap[a._id] || 0;
        const bFavorites = wallpaperFavoritesMap[b._id] || 0;
        return sortOrder.toLowerCase() === "asc"
          ? aFavorites - bFavorites
          : bFavorites - aFavorites;
      });

      const total = sortedWallpapers.length;
      const paginatedResults = sortedWallpapers.slice(
        (page - 1) * limit,
        page * limit
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieved Successfully",
        data: {
          data: paginatedResults,
          meta: {
            page,
            limit,
            total,
          },
        },
      });
    }

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

const getPopularTags = async (req, res) => {
  try {
    // Aggregate the tags and their corresponding total views
    const result = await Wallpaper.aggregate([
      { $match: { status: WALLPAPER_ENUMS.STATUS[1] } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", totalViews: { $sum: "$view" } } },
      { $sort: { totalViews: -1 } },
      { $limit: 32 },
      { $project: { tag: "$_id", _id: 0 } },
    ]);

    // Extract tags from the result
    const tags = result.map((item) => item.tag);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Tags retrieved successfully",
      data: tags,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Tags retrieve error",
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
  getPopularWallpapers,
  getFeaturedWallpapers,
  getOfficialWallpapers,
  updateWallpaperTag,
  addNewViewById,
  getSearchAndFilterWallpapers,
  getPopularTags,
};
