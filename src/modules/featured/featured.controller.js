const Profile = require("../profile/profile.model");
const { ROLE_DATA } = require("../user/user.constants");
const User = require("../user/user.model");
const Featured = require("./featured.model");

const addFeatured = async (req, res) => {
  try {
    const type = req.body?.type || "";
    await Featured.deleteMany({ type: type });
    const result = await Featured.insertMany(req.body?.items);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Featured Created Successfully",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: true,
      message: "Featured add unSuccessfully",
    });
  }
};

const getFeaturedWallpapers = async (req, res) => {
  try {
    const result = await Featured.find({
      type: "Wallpaper",
      targetType: "Wallpaper",
    })
      .limit(6)
      .sort({ serialNo: -1 })
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "wallpaper slug",
            });
            return {
              ...currentItem.toObject(),
              wallpaper: currentItem?.targetId?.wallpaper,
              slug: currentItem?.targetId?.slug,
              targetId: currentItem?.targetId?._id,
            };
          })
        );
        return populatedFeatured;
      });

    res.status(200).json({
      success: true,
      message: "Featured Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Featured Retrieve Failed",
      error_message: error.message,
    });
  }
};

const getContactFeatured = async (req, res) => {
  try {
    const result = await Featured.find({
      type: "Contact",
      targetType: "Wallpaper",
    })
      .limit(6)
      .sort({ serialNo: -1 })
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "wallpaper slug",
            });
            return {
              ...currentItem.toObject(),
              wallpaper: currentItem?.targetId?.wallpaper,
              slug: currentItem?.targetId?.slug,
              targetId: currentItem?.targetId?._id,
            };
          })
        );
        return populatedFeatured;
      });

    res.status(201).json({
      success: true,
      message: "Featured Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Featured Retrieve Failed",
      error_message: error.message,
    });
  }
};

const getStaffFeatured = async (req, res) => {
  try {
    const result = await Featured.find({
      type: "Staff",
      targetType: "Wallpaper",
    })
      .limit(6)
      .sort({ serialNo: -1 })
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "wallpaper slug",
            });
            return {
              ...currentItem.toObject(),
              wallpaper: currentItem?.targetId?.wallpaper,
              slug: currentItem?.targetId?.slug,
              targetId: currentItem?.targetId?._id,
            };
          })
        );
        return populatedFeatured;
      });

    res.status(201).json({
      success: true,
      message: "Featured Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Featured Retrieve Failed",
      error_message: error.message,
    });
  }
};

const getCredentialsFeatured = async (req, res) => {
  try {
    const result = await Featured.find({
      type: "Credential",
      targetType: "Wallpaper",
    })
      .limit(6)
      .sort({ serialNo: -1 })
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "wallpaper slug",
            });
            return {
              ...currentItem.toObject(),
              wallpaper: currentItem?.targetId?.wallpaper,
              slug: currentItem?.targetId?.slug,
              targetId: currentItem?.targetId?._id,
            };
          })
        );
        return populatedFeatured;
      });

    res.status(201).json({
      success: true,
      message: "Featured Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Featured Retrieve Failed",
      error_message: error.message,
    });
  }
};

const getArtistsFeatured = async (req, res) => {
  try {
    const result = await Featured.find({
      type: "Artist",
      targetType: "User",
    })
      .limit(6)
      .sort({ serialNo: -1 })
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "username slug name role verification_status",
            });

            const profile = await Profile.findOne({
              user: currentItem?.targetId?._id,
            }).select("profile_image");
            return {
              ...currentItem.toObject(),
              username: currentItem?.targetId?.username,
              slug: currentItem?.targetId?.slug,
              name: currentItem?.targetId?.name,
              role: currentItem?.targetId?.role,
              verification_status: currentItem?.targetId?.verification_status,
              profile_image: profile?.profile_image,
              targetId: currentItem?.targetId?._id,
            };
          })
        );
        return populatedFeatured;
      });

    res.status(201).json({
      success: true,
      message: "Featured Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Featured Retrieve Failed",
      error_message: error.message,
    });
  }
};

const getBrandsFeatured = async (req, res) => {
  try {
    const result = await Featured.find({
      type: "Brand",
      targetType: "User",
    })
      .limit(10)
      .sort({ serialNo: -1 })
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            await currentItem.populate({
              path: "targetId",
              model: currentItem.targetType,
              select: "username slug name role verification_status",
            });

            const profile = await Profile.findOne({
              user: currentItem?.targetId?._id,
            }).select("official_banner banner");

            return {
              ...currentItem.toObject(),
              username: currentItem?.targetId?.username,
              slug: currentItem?.targetId?.slug,
              name: currentItem?.targetId?.name,
              brandName:
                currentItem?.targetId?.role === ROLE_DATA.BRAND &&
                currentItem?.targetId?.verification_status === true
                  ? currentItem?.targetId?.name
                  : currentItem?.targetId?.username,
              role: currentItem?.targetId?.role,
              banner:
                currentItem?.targetId?.role === ROLE_DATA.BRAND &&
                currentItem?.targetId?.verification_status === true
                  ? profile?.official_banner || ""
                  : profile?.banner || "",
              targetId: currentItem?.targetId?._id,
            };
          })
        );
        return populatedFeatured;
      });

    res.status(201).json({
      success: true,
      message: "Featured Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Featured Retrieve Failed",
      error_message: error.message,
    });
  }
};
const getBrandsFeaturedData = async (req, res) => {
  try {
    const items = await Featured.aggregate([
      { $match: { type: "Brand", targetType: "User" } },
      { $sample: { size: 10 } },
    ]);

    const populatedFeatured = await Promise.all(
      items.map(async (currentItem) => {
        const user = await User.findById({ _id: currentItem.targetId }).select(
          "username slug name role verification_status verified"
        );

        const profile = await Profile.findOne({
          user: currentItem?.targetId,
        }).select("official_banner banner");

        return {
          ...currentItem,
          username: user?.username,
          slug: user?.slug,
          name: user?.name,
          role: user?.role,
          banner:
            user?.role === ROLE_DATA.BRAND && user?.verification_status === true
              ? profile?.official_banner || ""
              : profile?.banner || "",
        };
      })
    );

    res.status(201).json({
      success: true,
      message: "Featured artists retrieve Success",
      data: populatedFeatured,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Featured Retrieve Failed",
      error_message: error.message,
    });
  }
};

const getArtistsFeaturedData = async (req, res) => {
  try {
    const items = await Featured.aggregate([
      { $match: { type: "Artist", targetType: "User" } },
      { $sample: { size: 5 } },
    ]);

    const populatedFeatured = await Promise.all(
      items.map(async (currentItem) => {
        const user = await User.findById({ _id: currentItem.targetId }).select(
          "username slug name role verification_status verified"
        );

        const profile = await Profile.findOne({
          user: currentItem?.targetId,
        }).select("profile_image");

        return {
          ...currentItem,
          username: user?.username,
          slug: user?.slug,
          name: user?.name,
          role: user?.role,
          verified: user?.verified,
          verification_status: user?.verification_status,
          profile_image: profile?.profile_image,
        };
      })
    );

    res.status(201).json({
      success: true,
      message: "Featured artists retrieve Success",
      data: populatedFeatured,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Featured artists retrieve Failed",
      error_message: error.message,
    });
  }
};

const getFeaturedData = async (req, res) => {
  try {
    const { type = "", targetType = "", limit } = req.query;

    const items = await Featured.aggregate([
      { $match: { type: type, targetType: targetType } },
      { $sample: { size: parseInt(limit) || 3 } },
    ]);

    const populatedFeatured = await Promise.all(
      items.map(async (currentItem) => {
        const populatedItem = await Featured.populate(currentItem, {
          path: "targetId",
          model: currentItem.targetType,
          select: "wallpaper slug",
        });
        return {
          ...populatedItem,
          wallpaper: populatedItem?.targetId?.wallpaper,
          slug: populatedItem?.targetId?.slug,
          targetId: populatedItem?.targetId?._id,
        };
      })
    );

    res.status(201).json({
      success: true,
      message: "Featured Retrieve Success",
      data: populatedFeatured,
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

// for credentials

const getFeaturedCredentialData = async (req, res) => {
  try {
    const items = await Featured.aggregate([
      { $match: { type: "Credential", targetType: "Wallpaper" } },
      { $sample: { size: 1 } },
    ]);

    const populatedFeatured = await Promise.all(
      items.map(async (currentItem) => {
        const populatedItem = await Featured.populate(currentItem, {
          path: "targetId",
          model: currentItem.targetType,
          select: "wallpaper slug",
        });
        return {
          ...populatedItem,
          wallpaper: populatedItem?.targetId?.wallpaper,
          slug: populatedItem?.targetId?.slug,
          targetId: populatedItem?.targetId?._id,
        };
      })
    );

    res.status(201).json({
      success: true,
      message: "Featured Retrieve Success",
      data: populatedFeatured[0] || null,
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

module.exports = {
  addFeatured,
  getFeaturedWallpapers,
  getContactFeatured,
  getStaffFeatured,
  getFeaturedData,
  getCredentialsFeatured,
  getArtistsFeatured,
  getArtistsFeaturedData,
  getFeaturedCredentialData,
  getBrandsFeatured,
  getBrandsFeaturedData,
};
