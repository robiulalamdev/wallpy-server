const Profile = require("../profile/profile.model");
const { ROLE_DATA } = require("../user/user.constants");
const User = require("../user/user.model");
const Wallpaper = require("../wallpaper/wallpaper.model");
const Sponsor = require("./sponsor.model");

const addSponsor = async (req, res) => {
  try {
    const type = req.body?.type || "";
    await Sponsor.deleteMany({ type: type });
    const result = await Sponsor.insertMany(req.body?.items);
    res.status(201).json({
      status: 201,
      success: true,
      message: "Sponsor Created Successfully",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: true,
      message: "Sponsor add unSuccessfully",
    });
  }
};

const addSponsorForNewTrending = async (req, res) => {
  try {
    const type = req.body?.type || "Trending";
    const sponsors = await Sponsor.find({
      type: type,
      targetType: "Wallpaper",
    }).select("targetId");
    const ids = sponsors.map((item) => item?.targetId);
    if (ids?.length > 0) {
      await Wallpaper.updateMany(
        { _id: { $in: ids } },
        { $set: { isFeatured: false } }
      );
    }
    await Sponsor.deleteMany({ type: type });
    const result = await Sponsor.insertMany(req.body?.items);
    const newIds = req.body?.items.map((item) => item?.targetId);
    if (newIds?.length > 0) {
      await Wallpaper.updateMany(
        { _id: { $in: newIds } },
        { $set: { isFeatured: true } }
      );
    }

    res.status(201).json({
      status: 201,
      success: true,
      message: "Sponsor Created Successfully",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: true,
      message: "Sponsor add unSuccessfully",
    });
  }
};

// this is for user type => Main
const getMainSponsors = async (req, res) => {
  try {
    const result = await Sponsor.find({
      type: "Main",
    })
      .limit(5)
      .sort({ serialNo: -1 })
      // .populate("user", "username slug role verification_status")
      .then(async function (items) {
        const populatedSponsor = await Promise.all(
          items.map(async (currentItem) => {
            const user = await User.findById({
              _id: currentItem.targetId,
            }).select("username slug role verification_status");
            const profile = await Profile.findOne({
              user: user?._id,
            }).select("banner official_banner");
            return {
              userId: user?._id,
              username: user?.username,
              slug: user?.slug,
              banner:
                user?.role === ROLE_DATA.BRAND &&
                user?.verification_status === true
                  ? profile?.official_banner || ""
                  : profile?.banner || "",
            };
          })
        );
        return populatedSponsor;
      });

    res.status(201).json({
      success: true,
      message: "Sponsors Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Sponsors Retrieve Failed",
      error_message: error.message,
    });
  }
};

// this is for user type and Main
const getMainSponsorsData = async (req, res) => {
  try {
    const result = await Sponsor.find({
      type: "Main",
    })
      .limit(4)
      .sort({ _id: -1 })
      // .populate("user", "username slug role verification_status")
      .select("_id targetId")
      .exec(); // Use exec to handle promises explicitly

    const populatedSponsor = await Promise.all(
      result.map(async (currentItem) => {
        if (!currentItem || !currentItem._id) {
          console.error("Sponsor item or _id is missing:", currentItem);
          return null;
        }

        const user = await User.findById({
          _id: currentItem.targetId,
        }).select("username slug role verification_status");

        const profile = await Profile.findOne({
          user: user?._id,
        }).select("banner official_banner");

        return {
          _id: currentItem._id.toString(),
          userId: user?._id,
          username: user?.username,
          slug: user?.slug,
          banner:
            user?.role === ROLE_DATA.BRAND && user?.verification_status === true
              ? profile?.official_banner || ""
              : profile?.banner || "",
        };
      })
    );

    const validSponsors = populatedSponsor.filter((item) => item !== null);

    res.status(201).json({
      success: true,
      message: "Sponsors Retrieve Success",
      data: validSponsors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sponsors Retrieve Failed",
      error_message: error.message,
    });
  }
};

const getOfficialSponsorData = async (req, res) => {
  try {
    const items = await Sponsor.aggregate([
      { $match: { type: "Official", targetType: "Wallpaper" } },
      { $sample: { size: 3 } },
    ]);

    const populatedFeatured = await Promise.all(
      items.map(async (currentItem) => {
        const populatedItem = await Wallpaper.findById({
          _id: currentItem?.targetId,
        }).select("wallpaper slug");
        return {
          ...currentItem,
          wallpaper: populatedItem?.wallpaper,
          slug: populatedItem?.slug,
          targetId: populatedItem?._id,
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

const sponsorClickThrough = async (req, res) => {
  try {
    const result = await Sponsor.updateOne(
      { _id: req.params.id },
      {
        $push: {
          clickThrough: req.body.date || Date.now(),
        },
      }
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Sponsor Click Through Successfully",
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

//* for Official  Sponsor type: Official targetType: Wallpaper
const getOfficialWallpaperSponsors = async (req, res) => {
  try {
    const result = await Sponsor.find({
      type: "Official",
    })
      .limit(5)
      .sort({ serialNo: -1 })
      .then(async function (items) {
        const populatedSponsor = await Promise.all(
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
        return populatedSponsor;
      });

    res.status(201).json({
      success: true,
      message: "Sponsors Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Sponsors Retrieve Failed",
      error_message: error.message,
    });
  }
};

//* for Official  Sponsor type: Trending targetType: Wallpaper
const getNewTrendingWallpaperSponsors = async (req, res) => {
  try {
    const result = await Sponsor.find({
      type: "Trending",
    })
      .limit(5)
      .sort({ serialNo: -1 })
      .then(async function (items) {
        const populatedSponsor = await Promise.all(
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
        return populatedSponsor;
      });

    res.status(201).json({
      success: true,
      message: "Sponsors Retrieve Success",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Sponsors Retrieve Failed",
      error_message: error.message,
    });
  }
};

module.exports = {
  addSponsor,
  addSponsorForNewTrending,

  getMainSponsors,
  getMainSponsorsData,
  getOfficialSponsorData,
  sponsorClickThrough,

  // official sponsors
  getOfficialWallpaperSponsors,

  // new trading
  getNewTrendingWallpaperSponsors,
};
