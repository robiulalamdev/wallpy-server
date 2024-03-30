const { getUserInfoById } = require("../user/user.service");
const Settings = require("./settings.model");

const updateSettings = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user?._id);
    if (isExistUser) {
      const result = await Settings.findByIdAndUpdate(
        {
          _id: isExistUser?.settings?._id?.toString(),
        },
        {
          $set: req.body,
        },
        { new: false }
      );
      res.status(200).json({
        status: 200,
        success: true,
        message: "Settings Changed successfully",
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User not Found!",
      });
    }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Retrieve Failed!",
      error_message: error.message,
    });
  }
};

module.exports = {
  updateSettings,
};
