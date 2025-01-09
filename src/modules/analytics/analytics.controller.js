// Adjust the path as necessary

const { default: mongoose } = require("mongoose");
const Sponsor = require("../sponsor/sponsor.model");
const User = require("../user/user.model");
const { WALLPAPER_ENUMS } = require("../wallpaper/wallpaper.constant");
const Wallpaper = require("../wallpaper/wallpaper.model");
const Analytics = require("./analytics.model");
const { trackingVisitor } = require("./analytics.service");
const { ROLE_DATA } = require("../user/user.constants");
const Profile = require("../profile/profile.model");

const handleTrackingVisitor = async (req, res) => {
  try {
    const result = await trackingVisitor(req.ip);
    if (result) {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Tracking Successfully",
      });
    } else {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Tracking Failed",
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
          const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

          // Calculate the start of the current week (previous Sunday)
          const firstDayOfWeek = new Date(currentDate);
          firstDayOfWeek.setDate(currentDate.getDate() - dayOfWeek);
          firstDayOfWeek.setHours(0, 0, 0, 0); // Set to start of the day (midnight)

          // Calculate the end of the current week (current Sunday)
          const lastDayOfWeek = new Date(firstDayOfWeek);
          lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 7); // Add 7 days for a full week
          lastDayOfWeek.setHours(0, 0, 0, 0); // Set to start of the day (midnight)

          startDate = firstDayOfWeek;
          endDate = lastDayOfWeek;
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
          startDate = null; // Default to all time if unknown value
          endDate = null; // Current date/time
      }
    } else {
      // Default to all time if no date filter is provided
      startDate = null;
      endDate = null;
    }

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
        {
          $group: {
            _id: null,
            totalDownloads: { $sum: "$downloadsCount" },
          },
        },
      ]),

      Wallpaper.countDocuments({
        status: WALLPAPER_ENUMS.STATUS[1],
        ...(startDate && endDate
          ? { createdAt: { $gte: startDate, $lte: endDate } }
          : {}),
      }),

      User.countDocuments({
        ...(startDate && endDate
          ? { createdAt: { $gte: startDate, $lte: endDate } }
          : {}),
      }),

      Analytics.aggregate([
        {
          $match: {
            ...(startDate && endDate
              ? { createdAt: { $gte: startDate, $lt: endDate } }
              : {}),
          },
        },
        {
          $project: {
            visitorsCount: { $size: "$visitors" },
          },
        },
      ]),
    ]);

    const sponsors = await Sponsor.find({ type: "Main" }).then(async function (
      items
    ) {
      const populatedSponsor = await Promise.all(
        items.map(async (currentItem) => {
          let clicks = [];
          if (startDate && endDate) {
            clicks = await Sponsor.aggregate([
              {
                $match: {
                  _id: new mongoose.Types.ObjectId(currentItem?._id),
                  clickThrough: {
                    $elemMatch: {
                      $gte: new Date(startDate),
                      $lt: new Date(endDate),
                    },
                  },
                },
              },
              {
                $project: {
                  clicks: {
                    $size: {
                      $filter: {
                        input: "$clickThrough",
                        as: "date",
                        cond: {
                          $and: [
                            { $gte: ["$$date", new Date(startDate)] },
                            { $lt: ["$$date", new Date(endDate)] },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            ]);
          } else {
            clicks = [{ clicks: currentItem?.clickThrough?.length }];
          }

          const profile = await Profile.findOne({
            user: currentItem?.targetId,
          }).select("banner official_banner");

          return {
            totalClicks: clicks[0]?.clicks || 0,
            banner:
              currentItem?.user?.role === ROLE_DATA.BRAND &&
              currentItem?.user?.verification_status === true
                ? profile?.official_banner || ""
                : profile?.banner || "",
          };
        })
      );
      return populatedSponsor;
    });

    sponsors.sort((a, b) => a.totalClicks - b.totalClicks);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: {
        totalDownloadedWallpapers: downloadedWallpapers[0]?.totalDownloads || 0,
        totalUploadedWallpapers: uploadedWallpapers,
        totalRegisteredAccounts: registeredAccounts,
        totalVisitors: totalVisitors[0]?.visitorsCount || 0,
        sponsors: sponsors,
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

module.exports = { handleTrackingVisitor, getDashboardStats };
