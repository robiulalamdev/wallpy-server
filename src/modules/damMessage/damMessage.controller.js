const Profile = require("../profile/profile.model");
const DamMessage = require("./damMessage.model");

const createDamMessage = async (req, res) => {
  try {
    const newMessage = new DamMessage({
      message: req.body?.message || "",
      user: req.user?._id,
    });
    const savedMessage = await newMessage.save();
    const populatedMessage = await DamMessage.findById(
      savedMessage._id
    ).populate({
      path: "user",
      select: "role username name email",
    });
    const userProfile = await Profile.findOne({
      user: populatedMessage?.user?._id,
    }).select("profile_image");

    res.status(200).json({
      success: true,
      message: "Message Send Successfully",
      data: {
        ...populatedMessage.toObject(),
        user: {
          ...populatedMessage?.user.toObject(),
          profile: { profile_image: userProfile?.profile_image },
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Message create unSuccessfully",
    });
  }
};

const getAllDamMessages = async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 50;
    const skip = (page - 1) * limit;

    const result = await DamMessage.find({})
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        select: "role username name email",
      })
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            const userProfile = await Profile.findOne({
              user: currentItem?.user?._id,
            }).select("profile_image");
            return {
              ...currentItem.toObject(),
              user: {
                ...currentItem?.user.toObject(),
                profile: { profile_image: userProfile?.profile_image },
              },
            };
          })
        );
        return populatedFeatured;
      });

    const total = await DamMessage.countDocuments({});

    res.status(200).json({
      success: true,
      message: "Messages Retrieve Successfully",
      data: result.reverse(),
      meta: {
        total: total,
        page: page,
        limit: limit,
      },
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Messages Retrieve unSuccessfully",
      error_message: error.message,
    });
  }
};

const clearDamMessages = async (req, res) => {
  try {
    const result = await DamMessage.deleteMany({});
    res.status(200).json({
      success: true,
      message: "Messages removed Successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Message removed unSuccessfully",
    });
  }
};

module.exports = {
  createDamMessage,
  getAllDamMessages,
  clearDamMessages,
};
