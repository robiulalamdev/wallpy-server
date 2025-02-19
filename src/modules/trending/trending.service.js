const Wallpaper = require("../wallpaper/wallpaper.model");
const Trending = require("./trending.model");

//* Old system
// const generateTrendingWallpapers = async () => {
//   try {
//     const todayDate = new Date().toISOString().split("T")[0];

//     const existingTrending = await Trending.findOne({ date: todayDate });
//     if (existingTrending) {
//       return {
//         success: false,
//         message: "Trending wallpapers already saved for today.",
//       };
//     }

//     const wallpapers = await Wallpaper.aggregate([
//       {
//         $sort: { view: -1, createdAt: -1 },
//       },
//       {
//         $project: { _id: 1 },
//       },
//     ]);

//     const wallpaperIds = wallpapers.map((w) => w._id);

//     // Save new trending wallpapers
//     const newTrending = new Trending({
//       wallpapers: wallpaperIds,
//       date: todayDate,
//     });
//     await newTrending.save();
//     return {
//       success: true,
//       message: "Trending wallpapers generated successfully.",
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// };

//* For low traffic
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

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch most viewed wallpapers in last 24 hours
    const mostViewedWallpapers = await Wallpaper.aggregate([
      {
        $project: {
          _id: 1,
          viewsLast24Hours: {
            $filter: {
              input: "$views",
              as: "viewTime",
              cond: { $gte: ["$$viewTime", twentyFourHoursAgo] },
            },
          },
        },
      },
      {
        $match: { "viewsLast24Hours.0": { $exists: true } },
      },
      {
        $project: { _id: 1, viewsCount: { $size: "$viewsLast24Hours" } },
      },
      { $sort: { viewsCount: -1 } },
    ]);

    // Fetch newly uploaded wallpapers in the last 7 days
    const newWallpapers = await Wallpaper.find(
      { createdAt: { $gte: sevenDaysAgo } },
      { _id: 1 }
    ).sort({ createdAt: -1 });

    // Merge and remove duplicates
    const wallpaperIds = [
      ...new Set([
        ...mostViewedWallpapers.map((w) => w._id.toString()),
        ...newWallpapers.map((w) => w._id.toString()),
      ]),
    ];

    // Save the new trending wallpapers
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

//* Final system
// const generateTrendingWallpapers = async () => {
//   try {
//     const todayDate = new Date().toISOString().split("T")[0];

//     const existingTrending = await Trending.findOne({ date: todayDate });
//     if (existingTrending) {
//       return {
//         success: false,
//         message: "Trending wallpapers already saved for today.",
//       };
//     }

//     const twentyFourHoursAgo = new Date();
//     twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

//     const wallpapers = await Wallpaper.aggregate([
//       {
//         $project: {
//           _id: 1,
//           viewsLast24Hours: {
//             $filter: {
//               input: "$views",
//               as: "viewTime",
//               cond: { $gte: ["$$viewTime", twentyFourHoursAgo] },
//             },
//           },
//         },
//       },
//       {
//         $match: { "viewsLast24Hours.0": { $exists: true } },
//       },
//       {
//         $project: { _id: 1, viewsCount: { $size: "$viewsLast24Hours" } },
//       },
//       { $sort: { viewsCount: -1 } },
//     ]);

//     if (wallpapers.length === 0) {
//       return {
//         success: false,
//         message: "No wallpapers were viewed in the last 24 hours.",
//       };
//     }

//     const wallpaperIds = wallpapers.map((w) => w._id);
//     // Save new trending wallpapers
//     const newTrending = new Trending({
//       wallpapers: wallpaperIds,
//       date: todayDate,
//     });
//     await newTrending.save();

//     return {
//       success: true,
//       message: "Trending wallpapers generated successfully.",
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// };

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
