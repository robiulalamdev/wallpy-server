const Wallpaper = require("../wallpaper/wallpaper.model");
const Trending = require("./trending.model");

const generateTrendingWallpapers = async () => {
  try {
    const todayDate = new Date().toISOString().split("T")[0];

    const existingTrending = await Trending.findOne({ date: todayDate });
    if (existingTrending) {
      return {
        success: false,
        message: "Trending wallpapers already saved for today.",
      };
    }

    const wallpapers = await Wallpaper.aggregate([
      {
        $sort: { view: -1, createdAt: -1 },
      },
      {
        $project: { _id: 1 },
      },
    ]);

    const wallpaperIds = wallpapers.map((w) => w._id);

    // Save new trending wallpapers
    const newTrending = new Trending({
      wallpapers: wallpaperIds,
      date: todayDate,
    });
    await newTrending.save();
    return {
      success: true,
      message: "Trending wallpapers generated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getLatestTrendingWallpaperIds = async () => {
  try {
    const result = await Trending.findOne().sort({ date: -1 }).limit(1);

    return {
      success: true,
      message: "Trending wallpapers retrieved successfully.",
      data: result?.wallpapers || [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  generateTrendingWallpapers,
  getLatestTrendingWallpaperIds,
};
