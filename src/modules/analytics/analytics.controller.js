// Adjust the path as necessary

const User = require("../user/user.model");
const { WALLPAPER_ENUMS } = require("../wallpaper/wallpaper.constant");
const Wallpaper = require("../wallpaper/wallpaper.model");
const Analytics = require("./analytics.model");

const getDashboardStats = async (req, res) => {
  try {
    const currentDate = new Date();
    let startDate, endDate;

    if (req.query.date) {
      switch (req.query.date.toLowerCase()) {
        case "today":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ); // Today 00:00
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          ); // Tomorrow 00:00
          break;
        case "yesterday":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - 1
          ); // Yesterday 00:00
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ); // Today 00:00
          break;
        case "this week":
          const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            firstDayOfWeek
          ); // First day of this week 00:00
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            firstDayOfWeek + 7
          ); // First day of next week 00:00
          break;
        case "this month":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          ); // First day of this month 00:00
          endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            1
          ); // First day of next month 00:00
          break;
        case "this year":
          startDate = new Date(currentDate.getFullYear(), 0, 1); // First day of this year 00:00
          endDate = new Date(currentDate.getFullYear() + 1, 0, 1); // First day of next year 00:00
          break;

        default:
          startDate = new Date(0); // Default to all time if unknown value
          endDate = currentDate; // Current date/time
      }
    } else {
      // Default to all time if no date filter is provided
      startDate = new Date(0);
      endDate = currentDate;
    }

    // Convert dates to ISO strings
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    // Perform the aggregation queries
    const [
      downloadedWallpapers,
      uploadedWallpapers,
      registeredAccounts,
      totalVisitors,
    ] = await Promise.all([
      Wallpaper.aggregate([
        {
          $project: {
            downloads: {
              $ifNull: ["$downloads", []],
            },
          },
        },
        {
          $project: {
            downloads: {
              $filter: {
                input: "$downloads",
                as: "download",
                cond: {
                  $and: [
                    { $gte: ["$$download", startDate] },
                    { $lt: ["$$download", endDate] },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            downloadsCount: { $size: "$downloads" },
          },
        },
        { $group: { _id: null, totalDownloads: { $sum: "$downloadsCount" } } },
      ]),

      Wallpaper.countDocuments({
        status: WALLPAPER_ENUMS.STATUS[1],
        createdAt: { $gte: startDate, $lte: endDate },
      }),

      User.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      }),

      Analytics.aggregate([
        { $match: { date: { $gte: startISO, $lte: endISO } } },
        { $group: { _id: null, totalVisitors: { $sum: "$visitors" } } },
      ]),
    ]);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: {
        totalDownloadedWallpapers: downloadedWallpapers[0]?.totalDownloads || 0,
        totalUploadedWallpapers: uploadedWallpapers,
        totalRegisteredAccounts: registeredAccounts,
        totalVisitors: totalVisitors[0]?.totalVisitors || 0,
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

module.exports = { getDashboardStats };
