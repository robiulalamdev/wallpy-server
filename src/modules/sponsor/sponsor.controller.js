const Profile = require("../profile/profile.model");
const { ROLE_DATA } = require("../user/user.constants");
const User = require("../user/user.model");
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

const getMainSponsors = async (req, res) => {
  try {
    const result = await Sponsor.find({
      type: "Main",
    })
      .limit(5)
      .sort({ serialNo: -1 })
      .populate("user", "username role verification_status")
      .then(async function (items) {
        const populatedSponsor = await Promise.all(
          items.map(async (currentItem) => {
            const profile = await Profile.findOne({
              user: currentItem?.user?._id,
            }).select("banner official_banner");
            return {
              userId: currentItem?.user?._id,
              username: currentItem?.user?.username,
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

const getMainSponsorsData = async (req, res) => {
  try {
    const result = await Sponsor.find({
      type: "Main",
    })
      .limit(4)
      .sort({ _id: -1 })
      .populate("user", "username role verification_status")
      .then(async function (items) {
        const populatedSponsor = await Promise.all(
          items.map(async (currentItem) => {
            const profile = await Profile.findOne({
              user: currentItem?.user?._id,
            }).select("banner official_banner");
            console.log(currentItem);
            return {
              _id: currentItem?._id.toString(),
              userId: currentItem?.user?._id,
              username: currentItem?.user?.username,
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

module.exports = {
  addSponsor,
  getMainSponsors,
  getMainSponsorsData,
  sponsorClickThrough,
};
