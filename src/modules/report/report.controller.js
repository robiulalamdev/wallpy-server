const Profile = require("../profile/profile.model");
const User = require("../user/user.model");
const Wallpaper = require("../wallpaper/wallpaper.model");
const { REPORT_TYPES } = require("./report.constants");
const Report = require("./report.model");

const sendReport = async (req, res) => {
  try {
    const userId = req.user?._id;
    const isExist = await Report.findOne({
      $and: [
        { reporter: userId },
        { status: "Pending" },
        {
          $or: [
            { type: REPORT_TYPES.USER_REPORT },
            { type: REPORT_TYPES.CLAIM_REQUEST },
            { type: REPORT_TYPES.REMOVAL_REQUEST },
          ],
        },
      ],
    });

    if (isExist) {
      return res.status(200).json({
        status: 200,
        success: false,
        type: "exist",
        message: "Already Reported",
      });
    } else {
      const newReport = new Report({
        reporter: userId,
        targetId: req.body.targetId,
        type: req.body.type,
        targetType: req.body.targetType,
        message: req.body.message,
      });
      const result = await newReport.save();
      if (req.body.targetType === "User") {
        await User.updateOne(
          { _id: req.body.targetId },
          { $inc: { totalReports: 1 } }
        );
      } else {
        await Wallpaper.updateOne(
          { _id: req.body.targetId },
          { $inc: { totalReports: 1 } }
        );
      }
      res.status(200).json({
        status: 200,
        success: true,
        message: "Report created successfully",
        data: result,
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

const getRemovalRequests = async (req, res) => {
  try {
    const result = await Report.find({
      status: "Pending",
      type: REPORT_TYPES.REMOVAL_REQUEST,
    })
      .sort({
        _id: -1,
      })
      .populate("reporter", "username name role")
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "wallpaper slug createdAt totalReports username user",
            });

            const reporterImage = await Profile.findOne({
              user: currentItem?.reporter?._id,
            }).select("profile_image");

            const author = await Profile.findOne({
              user: currentItem?.targetId?.user,
            })
              .select("profile_image")
              .populate("user", "username");

            const newData = {
              _id: currentItem?._id,
              status: currentItem?.status,
              type: currentItem?.type,
              message: currentItem?.message,
              targetId: currentItem?.targetId?._id,
              targetType: currentItem?.targetType,
              reporter: {
                ...currentItem?.reporter.toObject(),
                profile: { profile_image: reporterImage?.profile_image },
              },
              createdAt: currentItem?.createdAt,
            };
            if (currentItem?.targetType === "Wallpaper") {
              const data = {
                wallpaper: currentItem?.targetId?.wallpaper,
                slug: currentItem?.targetId?.slug,
                totalReports: currentItem?.targetId?.totalReports,
                createdAt: currentItem?.targetId?.createdAt,
                author: {
                  username: author?.user?.username,
                  profile: { profile_image: author?.profile_image },
                },
              };
              newData["data"] = data;
            }

            if (currentItem?.type === REPORT_TYPES.REMOVAL_REQUEST) {
              newData["title"] = `has submitted a removal request.`;
            }
            return newData;
          })
        );
        return populatedFeatured;
      });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Reports retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Reports retrieve unSuccessfully",
      errorMessage: error.message,
    });
  }
};

const getClaimRequests = async (req, res) => {
  try {
    const result = await Report.find({
      status: "Pending",
      type: REPORT_TYPES.CLAIM_REQUEST,
    })
      .sort({
        _id: -1,
      })
      .populate("reporter", "username name role")
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "wallpaper slug createdAt totalReports username user",
            });

            const reporterImage = await Profile.findOne({
              user: currentItem?.reporter?._id,
            }).select("profile_image");

            const author = await Profile.findOne({
              user: currentItem?.targetId?.user,
            })
              .select("profile_image")
              .populate("user", "username");

            const newData = {
              _id: currentItem?._id,
              status: currentItem?.status,
              type: currentItem?.type,
              message: currentItem?.message,
              targetId: currentItem?.targetId?._id,
              targetType: currentItem?.targetType,
              reporter: {
                ...currentItem?.reporter.toObject(),
                profile: { profile_image: reporterImage?.profile_image },
              },
              createdAt: currentItem?.createdAt,
            };
            if (currentItem?.targetType === "Wallpaper") {
              const data = {
                wallpaper: currentItem?.targetId?.wallpaper,
                slug: currentItem?.targetId?.slug,
                totalReports: currentItem?.targetId?.totalReports,
                createdAt: currentItem?.targetId?.createdAt,
                author: {
                  username: author?.user?.username,
                  profile: { profile_image: author?.profile_image },
                },
              };
              newData["data"] = data;
            }

            if (currentItem?.type === REPORT_TYPES.CLAIM_REQUEST) {
              newData["title"] = `has submitted a claim.`;
            }
            return newData;
          })
        );
        return populatedFeatured;
      });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Reports retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Reports retrieve unSuccessfully",
      errorMessage: error.message,
    });
  }
};

const getUserReports = async (req, res) => {
  try {
    const result = await Report.find({
      status: "Pending",
      type: REPORT_TYPES.USER_REPORT,
    })
      .sort({
        _id: -1,
      })
      .populate("reporter", "username name role")
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "wallpaper slug createdAt totalReports username user",
            });

            const reporterImage = await Profile.findOne({
              user: currentItem?.reporter?._id,
            }).select("profile_image");

            const authorImage = await Profile.findOne({
              user: currentItem?.targetId?._id,
            }).select("profile_image");

            const newData = {
              _id: currentItem?._id,
              status: currentItem?.status,
              type: currentItem?.type,
              message: currentItem?.message,
              targetId: currentItem?.targetId?._id,
              targetType: currentItem?.targetType,
              reporter: {
                ...currentItem?.reporter.toObject(),
                profile: { profile_image: reporterImage?.profile_image },
              },
              createdAt: currentItem?.createdAt,
            };
            if (currentItem?.targetType === "User") {
              const data = {
                username: currentItem?.targetId?.username,
                totalReports: currentItem?.targetId?.totalReports,
                profile: { profile_image: authorImage?.profile_image },
              };
              newData["data"] = data;
            }

            if (currentItem?.type === REPORT_TYPES.USER_REPORT) {
              newData["title"] = `has reported an user.`;
            }
            return newData;
          })
        );
        return populatedFeatured;
      });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Reports retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Reports retrieve unSuccessfully",
      errorMessage: error.message,
    });
  }
};

const getReviewedReports = async (req, res) => {
  try {
    const result = await Report.find({
      $and: [
        { status: { $ne: "Pending" } },
        {
          $or: [{ status: "Dismiss" }, { status: "Reviewed" }],
        },
        {
          $or: [
            { type: REPORT_TYPES.CLAIM_REQUEST },
            { type: REPORT_TYPES.REMOVAL_REQUEST },
            { type: REPORT_TYPES.USER_REPORT },
          ],
        },
      ],
    })
      .sort({
        _id: -1,
      })
      .populate("reporter", "username name role")
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "wallpaper slug createdAt totalReports username user",
            });

            const reporterImage = await Profile.findOne({
              user: currentItem?.reporter?._id,
            }).select("profile_image");

            if (currentItem?.targetType === "Wallpaper") {
              var author = await Profile.findOne({
                user: currentItem?.targetId?.user,
              })
                .select("profile_image")
                .populate("user", "username");
            } else {
              var authorImage = await Profile.findOne({
                user: currentItem?.targetId?._id,
              }).select("profile_image");
            }

            const newData = {
              _id: currentItem?._id,
              status: currentItem?.status,
              type: currentItem?.type,
              message: currentItem?.message,
              targetId: currentItem?.targetId?._id,
              targetType: currentItem?.targetType,
              reporter: {
                ...currentItem?.reporter.toObject(),
                profile: { profile_image: reporterImage?.profile_image },
              },
              createdAt: currentItem?.createdAt,
            };
            if (currentItem?.targetType === "Wallpaper") {
              const data = {
                wallpaper: currentItem?.targetId?.wallpaper,
                slug: currentItem?.targetId?.slug,
                totalReports: currentItem?.targetId?.totalReports,
                createdAt: currentItem?.targetId?.createdAt,
                author: {
                  username: author?.user?.username,
                  profile: { profile_image: author?.profile_image },
                },
              };
              newData["data"] = data;
            }

            if (currentItem?.targetType === "User") {
              const data = {
                username: currentItem?.targetId?.username,
                totalReports: currentItem?.targetId?.totalReports,
                profile: { profile_image: authorImage?.profile_image },
              };
              newData["data"] = data;
            }

            if (currentItem?.type === REPORT_TYPES.USER_REPORT) {
              newData["title"] = `has reported an user.`;
            } else if (currentItem?.type === REPORT_TYPES.CLAIM_REQUEST) {
              newData["title"] = `has submitted a claim.`;
            } else if (currentItem?.type === REPORT_TYPES.REMOVAL_REQUEST) {
              newData["title"] = `has submitted a removal request.`;
            } else {
              newData["title"] = `has submitted a report.`;
            }
            return newData;
          })
        );
        return populatedFeatured;
      });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Reports retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Reports retrieve unSuccessfully",
      errorMessage: error.message,
    });
  }
};

const modifyReport = async (req, res) => {
  try {
    const { id } = req.params;

    const isExistVerify = await Report.findOne({ _id: id });
    if (isExistVerify) {
      if (req.body.status === "Dismiss") {
        const result = await Report.updateOne(
          { _id: id },
          { $set: { status: "Dismiss" } },
          { new: true }
        );

        if (isExistVerify?.targetType === "User") {
          await User.updateOne(
            { _id: isExistVerify?.targetId },
            { $inc: { totalReports: -1 } }
          );
        } else {
          await Wallpaper.updateOne(
            { _id: isExistVerify?.targetId },
            { $inc: { totalReports: -1 } }
          );
        }
        return res.status(200).json({
          success: true,
          message: "Report dismiss successfully",
          data: result,
        });
      }
      if (req.body.status === "Reviewed") {
        const result = await Report.updateOne(
          { _id: id },
          { $set: { status: "Reviewed" } },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Report reviewed successfully",
          data: result,
        });
      }
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Operation Failed",
      errorMessage: error.message,
    });
  }
};

const getTotalReports = async (req, res) => {
  try {
    const result = await Report.countDocuments({ status: "Pending" });
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Reports retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Reports retrieve unSuccessfully",
      errorMessage: error.message,
    });
  }
};

module.exports = {
  sendReport,
  getUserReports,
  getReviewedReports,
  getRemovalRequests,
  getClaimRequests,
  modifyReport,
  getTotalReports,
};
