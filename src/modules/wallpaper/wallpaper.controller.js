const Favorite = require("../favorite/favorite.model");
const Profile = require("../profile/profile.model");
const Settings = require("../settings/settings.model");
const Sponsor = require("../sponsor/sponsor.model");
const User = require("../user/user.model");
const { getUserInfoById } = require("../user/user.service");
const { WALLPAPER_ENUMS } = require("./wallpaper.constant");
const Wallpaper = require("./wallpaper.model");
const {
  wallpapersMake,
  singleWallpaperMake,
  getSingleSponsorWallpaper,
} = require("./wallpaper.service");

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

const uploadSingleWallpaper = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user._id);
    if (isExistUser) {
      if (req.file) {
        const wallpaper = await singleWallpaperMake(
          req.file,
          isExistUser?._id?.toString()
        );
        if (wallpaper) {
          const newWallpaper = new Wallpaper({ ...wallpaper });
          const result = await newWallpaper.save();
          res.status(200).json({
            success: true,
            data: result,
            message: "upload successfully",
          });
        } else {
          res.status(200).json({
            success: false,
            data: null,
            message: "upload unSuccessfully",
          });
        }
      } else {
        res.status(200).json({
          success: false,
          data: null,
          message: "upload unSuccessfully",
        });
      }
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

const getMyDraftWallpapers = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 30;
    const skip = (page - 1) * limit;
    const userId = req.user?._id;

    const isExistUser = await getUserInfoById(userId);
    if (isExistUser) {
      const query = {
        user: userId,
        status: WALLPAPER_ENUMS.STATUS[0],
      };
      const result = await Wallpaper.find(query)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Wallpaper.countDocuments(query);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieve Successfully",
        data: result,
        meta: {
          total: total,
          page: page,
          limit: limit,
        },
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

const getMyPublishedWallpapers = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 30;
    const skip = (page - 1) * limit;
    const userId = req.user?._id;

    const isExistUser = await getUserInfoById(userId);
    if (isExistUser) {
      const query = {
        user: userId,
        status: WALLPAPER_ENUMS.STATUS[1],
      };
      const result = await Wallpaper.find(query)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Wallpaper.countDocuments(query);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieve Successfully",
        data: result,
        meta: {
          total: total,
          page: page,
          limit: limit,
        },
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
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 18;
    const skip = (page - 1) * limit;

    const isExistUser = await getUserInfoById(req.params.userId);
    if (isExistUser) {
      const query = {
        user: req.params.userId,
        status: WALLPAPER_ENUMS.STATUS[1],
      };

      if (req?.user?._id) {
        const settings = await Settings.findOne({ user: req.user?._id }).select(
          "nsfw blacklist_tags"
        );
        if (settings?.nsfw === false) {
          query["classification"] = { $ne: "NSFW" };
        }
        if (settings?.blacklist_tags?.length > 0) {
          query["tags"] = {
            $not: {
              $elemMatch: { $in: settings?.blacklist_tags },
            },
          };
        }
      } else {
        query["classification"] = { $ne: "NSFW" };
      }
      const published = await Wallpaper.find(query)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Wallpaper.countDocuments(query);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieve Successfully",
        data: published,
        meta: {
          total: total,
          page: page,
          limit: limit,
        },
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
    let query = {
      slug: req.params?.slug,
      status: WALLPAPER_ENUMS.STATUS[1],
    };

    if (req.user?._id) {
      const settings = await Settings.findOne({ user: req.user?._id }).select(
        "nsfw blacklist_tags"
      );
      if (settings?.nsfw === false) {
        query["classification"] = { $ne: "NSFW" };
      }
      if (settings?.blacklist_tags?.length > 0) {
        query["tags"] = {
          $not: {
            $elemMatch: { $in: settings?.blacklist_tags },
          },
        };
      }
    } else {
      query["classification"] = { $ne: "NSFW" };
    }

    const result = await Wallpaper.findOne(query);
    if (result) {
      const getAuthor = await User.findById({
        _id: result?.user?.toString(),
      }).select("name username slug verified verification_status role");
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
        { type: { $regex: searchRegex } },
        { tags: { $elemMatch: { $regex: searchRegex } } },
      ];
    }

    // Filters
    const andQuery = [];
    if (req.query.type && req.query.type.toLowerCase() !== "all") {
      andQuery.push({
        type: { $regex: new RegExp(`^${req.query.type}$`, "i") },
      });
    }

    if (req.query.screen_type) {
      let screenTypeValue = req.query?.screen_type;
      if (req.query?.screen_type?.toLowerCase() === "mobile") {
        screenTypeValue = "Phones";
      }
      andQuery.push({
        screen_type: { $regex: new RegExp(`^${screenTypeValue}$`, "i") },
      });
    }

    if (req.user?._id) {
      const settings = await Settings.findOne({ user: req.user?._id }).select(
        "nsfw blacklist_tags"
      );
      if (settings?.nsfw === false) {
        andQuery.push({
          classification: { $ne: "NSFW" },
        });
      }
      if (settings?.blacklist_tags?.length > 0) {
        andQuery.push({
          tags: {
            $not: {
              $elemMatch: { $in: settings?.blacklist_tags },
            },
          },
        });
      }
    } else {
      query["classification"] = { $ne: "NSFW" };
    }

    if (Object.entries(andQuery).length > 0) {
      query.$and = andQuery;
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

    let sponsor = await getSingleSponsorWallpaper(page);
    if (sponsor) {
      limit--;
    }

    if (tn?.toLowerCase() === "trending") {
      let wallpapers = await Wallpaper.aggregate([
        {
          $match: query,
        },
        {
          $addFields: {
            latestDownload: {
              $cond: {
                if: { $gt: [{ $size: { $ifNull: ["$downloads", []] } }, 0] },
                then: { $max: "$downloads" },
                else: 0, // Default value for documents with no downloads
              },
            },
            downloadCount: {
              $cond: {
                if: { $gt: [{ $size: { $ifNull: ["$downloads", []] } }, 0] },
                then: { $size: "$downloads" },
                else: 0, // If downloads are empty or missing, set downloadCount to 0
              },
            },
          },
        },
        {
          $sort: {
            view: -1,
            downloadCount: -1,
            latestDownload: -1,
            ...sort,
          },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]);
      const total = wallpapers.length;

      if (sponsor) {
        wallpapers = [
          { ...sponsor?.toObject(), isFeatured: true },
          ...wallpapers,
        ];
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieved Successfully",
        data: {
          data: wallpapers,
          meta: {
            page,
            limit,
            total,
          },
        },
      });
    } else if (tn?.toLowerCase() === "top wallpapers") {
      let wallpapers = await Wallpaper.aggregate([
        {
          $match: query,
        },
        {
          $sort: {
            view: -1,
            ...sort,
          },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ]);

      const total = wallpapers.length;

      if (sponsor) {
        wallpapers = [
          { ...sponsor?.toObject(), isFeatured: true },
          ...wallpapers,
        ];
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpapers Retrieved Successfully",
        data: {
          data: wallpapers,
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
    let results = await Wallpaper.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    if (sponsor) {
      results = [{ ...sponsor?.toObject(), isFeatured: true }, ...results];
    }

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
      });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpaper deleted successfully",
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
    const { type = "", wallpaperId = "", limit = "3" } = req.query;
    const limitNumber = parseInt(limit, 10);

    let queryPipeline = [
      {
        $match: {
          $and: [{ status: WALLPAPER_ENUMS.STATUS[1] }],
        },
      },
      { $sample: { size: limitNumber } },
    ];

    if (type) {
      queryPipeline[0].$match.$and.push({ type: type });
    }

    if (wallpaperId) {
      queryPipeline[0].$match.$and.push({ _id: { $ne: wallpaperId } });
    }

    if (req.user?._id) {
      const settings = await Settings.findOne({ user: req.user?._id }).select(
        "nsfw blacklist_tags"
      );
      if (settings?.nsfw === false) {
        queryPipeline[0].$match.$and.push({ classification: { $ne: "NSFW" } });
      }
      if (settings?.blacklist_tags?.length > 0) {
        queryPipeline[0].$match.$and.push({
          tags: {
            $not: {
              $elemMatch: { $in: settings?.blacklist_tags },
            },
          },
        });
      }
    } else {
      queryPipeline[0].$match.$and.push({ classification: { $ne: "NSFW" } });
    }

    const result = await Wallpaper.aggregate(queryPipeline);

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
    const result = await Wallpaper.aggregate([
      { $match: { status: WALLPAPER_ENUMS.STATUS[1], isFeatured: true } },
      { $sample: { size: 3 } },
    ]);

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

const getFeaturedItems = async (req, res) => {
  try {
    const result = await Wallpaper.find({
      status: WALLPAPER_ENUMS.STATUS[1],
      isFeatured: true,
    })
      .sort({ _id: -1 })
      .limit(6);
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

const addFeaturedItems = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user._id);
    if (isExistUser) {
      await Wallpaper.updateMany(
        { isFeatured: true },
        {
          $set: { isFeatured: false },
        },
        { new: false }
      );
      const result = await Wallpaper.updateMany(
        { _id: { $in: req.body.ids } },
        {
          $set: { isFeatured: true },
        },
        { new: false }
      );
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpaper Operation Successfully",
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

const getInfoBySlug = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user._id);
    if (isExistUser) {
      const result = await Wallpaper.findOne({ slug: req.params.slug });
      res.status(200).json({
        status: 200,
        success: true,
        message: "Wallpaper Operation Successfully",
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

const addNewDownloadCountByWallId = async (req, res) => {
  try {
    const result = await Wallpaper.updateOne(
      { _id: req.params.wallpaperId },
      { $push: { downloads: Date.now() } }
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
    let {
      tag = "",
      name = "",
      search = "",
      type = "",
      screen_type = "",
      classification = "",
      width = "",
      height = "",
      date = "",
      page = 1,
      limit = 60,
      sort_by = "",
      sortOrder = "desc",
      tn = "trending",
    } = req.query;

    // Text search
    const pipeline = [
      {
        $match: {
          $and: [
            {
              status: WALLPAPER_ENUMS.STATUS[1],
            },
          ],
        },
      },
    ];

    const orPipeline = [];

    if (search) {
      const searchRegex = new RegExp(search, "i");
      orPipeline.push(
        { author: { $regex: searchRegex } },
        { source: { $regex: searchRegex } },
        { wallpaper: { $regex: searchRegex } },
        { screen_type: { $regex: searchRegex } },
        { type: { $regex: searchRegex } },
        { tags: { $elemMatch: { $regex: searchRegex } } }
      );
    }

    if (screen_type) {
      let screenTypeValue = screen_type;
      if (screen_type?.toLowerCase() === "mobile") {
        screenTypeValue = "Phones";
      }
      pipeline[0].$match.$and.push({
        screen_type: { $regex: new RegExp(`^${screenTypeValue}$`, "i") },
      });
    }

    if (type && type.toLowerCase() !== "all") {
      pipeline[0].$match.$and.push({
        type: { $regex: new RegExp(`^${type}$`, "i") },
      });
    }

    if (screen_type) {
      pipeline[0].$match.$and.push({
        screen_type: { $regex: new RegExp(`^${screen_type}$`, "i") },
      });
    }

    if (tag) {
      pipeline[0].$match.$and.push({
        tags: {
          $elemMatch: { $eq: tag },
        },
      });
    }

    if (name) {
      const brandUser = await User.findOne({ username: name }).select("_id");
      if (brandUser) {
        pipeline[0].$match.$and.push({
          user: brandUser?._id.toString(),
        });
      }
    }

    let settings = null;

    if (req.user?._id) {
      settings = await Settings.findOne({ user: req.user?._id }).select(
        "nsfw blacklist_tags"
      );
      if (settings?.nsfw === false) {
        pipeline[0].$match.$and.push({
          classification: { $ne: "NSFW" },
        });
      }
      if (settings?.blacklist_tags?.length > 0) {
        pipeline[0].$match.$and.push({
          tags: {
            $not: {
              $elemMatch: { $in: settings?.blacklist_tags },
            },
          },
        });
      }
    }

    if (classification.toLowerCase() === "nsfw" && settings?.nsfw === true) {
      pipeline[0].$match.$and.push({
        classification: "NSFW",
      });
    } else {
      let classificationName = "";
      // "SFW", "Risky"
      if (classification.toLowerCase() === "sfw") {
        classificationName = "SFW";
      } else if (classification.toLowerCase() === "risky") {
        classificationName = "Risky";
      }
      if (classificationName) {
        pipeline[0].$match.$and.push({
          classification: classificationName,
        });
      }
    }
    if (width) {
      pipeline[0].$match.$and.push({ "dimensions.width": parseInt(width) });
    }
    if (height) {
      pipeline[0].$match.$and.push({ "dimensions.height": parseInt(height) });
    }

    // Date="" filters
    const currentDate = new Date();
    let startDate;

    if (date) {
      switch (date.toLowerCase()) {
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

      pipeline[0].$match.$and.push({
        createdAt: { $gte: startDate, $lte: endDate },
      });
    }

    page = parseInt(page);
    limit = parseInt(limit);

    let sort = {};
    let sort_order = sortOrder === "asc" ? 1 : -1;

    let sponsor = await getSingleSponsorWallpaper(page);
    if (sponsor) {
      limit--;
    }

    if (tn?.toLowerCase() === "trending") {
      if (sort_by.toLowerCase() !== "views") {
        sort["view"] = -1;
      }
    } else if (tn?.toLowerCase() === "top wallpapers") {
      const topWallPipeline = [
        {
          $lookup: {
            from: "favorites",
            localField: "_id",
            foreignField: "wallpaper",
            as: "favorites",
          },
        },
        {
          $addFields: {
            totalFavorites: { $size: "$favorites" },
          },
        },
        {
          $unset: "favorites",
        },
      ];

      sort["totalFavorites"] = -1;
      sort["view"] = -1;

      pipeline.push(...topWallPipeline);
    } else if (tn?.toLowerCase() === "new") {
      sort["createdAt"] = -1;
    }

    // sort_by -> Random, Views, Favorites
    if (sort_by && sort_by.toLowerCase() === "views") {
      sort["view"] = sort_order;
    } else if (sort_by?.toLowerCase() === "favorites") {
      if (tn?.toLowerCase() !== "top wallpapers") {
        const sortByFavoritePipeline = [
          {
            $lookup: {
              from: "favorites",
              localField: "_id",
              foreignField: "wallpaper",
              as: "favorites",
            },
          },
          {
            $addFields: {
              totalFavorites: { $size: "$favorites" },
            },
          },
          {
            $unset: "favorites",
          },
        ];
        pipeline.push(...sortByFavoritePipeline);
        sort["totalFavorites"] = sort_order;
      } else {
        sort["totalFavorites"] = sort_order;
      }
    }

    if (orPipeline.length > 0) {
      pipeline[0].$match.$and.push({
        $or: orPipeline,
      });
    }

    const totalPipeline = [...pipeline, { $count: "total" }];

    // Fetch total count
    const totalResult = await Wallpaper.aggregate(totalPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    pipeline.push(
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    // console.log("Match: ", pipeline[0].$match, "Sort: ", sort);

    let results = await Wallpaper.aggregate(pipeline);

    if (sponsor) {
      results.unshift({ ...sponsor?.toObject(), isFeatured: true });
      limit++;
    }

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

const sponsorsWallpapers = async (req, res) => {
  try {
    let query = { status: WALLPAPER_ENUMS.STATUS[1] };

    if (req.query?.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { author: { $regex: searchRegex } },
        { source: { $regex: searchRegex } },
        { wallpaper: { $regex: searchRegex } },
        { tags: { $elemMatch: { $regex: searchRegex } } },
      ];
    }

    // Filters
    const andQuery = [];
    if (req.query.type && req.query.type.toLowerCase() !== "all") {
      andQuery.push({
        type: { $regex: new RegExp(`^${req.query.type}$`, "i") },
      });
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
        case "yesterday":
          startDate = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000); // Start of yesterday
          endDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // End of yesterday
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
        case "all data":
          startDate = new Date(0); // Unix epoch start date
          endDate = currentDate; // Current date/time
          break;
        default:
          startDate = new Date(0); // Default to all time if unknown value
          endDate = currentDate; // Current date/time
      }

      andQuery.push({ createdAt: { $gte: startDate, $lte: endDate } });
    }

    if (Object.entries(andQuery).length > 0) {
      query.$and = andQuery;
    }

    let { page = 1, limit = 35 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const total = await Wallpaper.countDocuments(query);
    const results = await Wallpaper.find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "username");

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

const getWallpapersByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const { page = 1, limit = 18 } = req.query;

    const pipeline = [
      {
        $match: { tags: { $eq: tag } },
      },
      {
        $facet: {
          totalView: [{ $group: { _id: null, totalView: { $sum: "$view" } } }],
          totalWallpapers: [{ $count: "count" }],
          relatedTags: [
            { $unwind: "$tags" },
            { $match: { tags: { $ne: tag } } },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 50 },
            { $project: { _id: 0, tag: "$_id" } },
          ],
        },
      },
    ];

    const result = await Wallpaper.aggregate(pipeline).exec();
    const wallpapers = await Wallpaper.find({
      tags: {
        $elemMatch: { $eq: tag },
      },
    })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalView =
      result[0].totalView.length > 0 ? result[0].totalView[0].totalView : 0;
    const relatedTags = result[0].relatedTags.map((tagObj) => tagObj.tag);

    const total = await Wallpaper.countDocuments({
      tags: {
        $elemMatch: { $eq: tag },
      },
    });

    res.status(200).json({
      success: true,
      message: "Wallpapers retrieved successfully",
      data: {
        relatedTags,
        totalView,
        totalWallpapers: total,
        data: wallpapers,
        meta: {
          total: total,
          page: Number(page),
          limit: Number(limit),
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

const getTopThreeFavoritedWallpapers = async (req, res) => {
  try {
    const topFavorites = await Favorite.aggregate([
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
        $limit: 3,
      },
    ]);

    // Extract the wallpaper IDs
    const wallpaperIds = topFavorites.map((fav) => fav._id);

    // Fetch the wallpaper details
    const wallpapers = await Wallpaper.find({ _id: { $in: wallpaperIds } });

    // Map the count to the wallpapers and sort by count in descending order
    const result = wallpapers
      .map((wallpaper) => {
        const count = topFavorites.find((fav) =>
          fav._id.equals(wallpaper._id)
        ).count;
        return { ...wallpaper.toObject(), count };
      })
      .sort((a, b) => b.count - a.count); // Sort by count in descending order

    res.status(200).json({
      status: 200,
      success: true,
      message: "Wallpapers Retrieved Successfully",
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

const getMostDownloadedWallpapers = async (req, res) => {
  try {
    const result = await Wallpaper.aggregate([
      { $match: { status: WALLPAPER_ENUMS.STATUS[1] } },
      {
        $project: {
          wallpaper: 1,
          slug: 1,
          downloadsCount: { $size: { $ifNull: ["$downloads", []] } },
        },
      },
      { $sort: { downloadsCount: -1 } },
      { $limit: 9 },
    ]);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Wallpapers Retrieved Successfully",
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

const getTopCategories = async (req, res) => {
  try {
    // Aggregate the tags and their corresponding total views
    const result = await Wallpaper.aggregate([
      { $match: { status: WALLPAPER_ENUMS.STATUS[1] } },
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          totalViews: { $sum: "$view" },
          downTotal: { $sum: { $size: { $ifNull: ["$downloads", []] } } },
        },
      },
      { $sort: { totalViews: -1, downTotal: -1 } },
      { $limit: 12 },
      {
        $project: {
          tag: "$_id",
          _id: 0,
        },
      },
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
  uploadSingleWallpaper,
  getWallpapers,
  getMyDraftWallpapers,
  getMyPublishedWallpapers,
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
  addNewDownloadCountByWallId,
  getSearchAndFilterWallpapers,
  getPopularTags,
  getWallpapersByTag,

  // dashboard
  sponsorsWallpapers,
  getFeaturedItems,
  addFeaturedItems,
  getInfoBySlug,
  getTopThreeFavoritedWallpapers,
  getMostDownloadedWallpapers,
  getTopCategories,
};
