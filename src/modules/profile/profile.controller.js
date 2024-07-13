const { removeFile } = require("../../config/multer");
const { updateSettingsBySetMethod } = require("../settings/settings.service");
const {
  getUserInfoById,
  updateUserWithSetMethod,
} = require("../user/user.service");
const Profile = require("./profile.model");
const { updateProfileBySetMethod } = require("./profile.service");

const verificationRequest = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user?._id);
    return res.status(200).json({
      status: 200,
      success: false,
      type: "exist",
      message: "currently this endpoint not using",
    });
    // if (isExistUser) {
    //   if (
    //     isExistUser?.profile?.verification_status === "Pending" ||
    //     isExistUser?.profile?.verification_status === "Approved"
    //   ) {
    //     res.status(200).json({
    //       status: 200,
    //       success: false,
    //       type: "exist",
    //       message: "Already Verification Requested",
    //     });
    //   } else {
    //     const updateData = {
    //       name: req.body.name,
    //       profile_type: req.body.profile_type,
    //       verification_status: "Pending",
    //     };
    //     if (req.file) {
    //       updateData["proof_of_identity"] = req.file?.path;
    //     }
    //     if (req.body?.other_verified_profiles?.length > 0) {
    //       updateData["other_verified_profiles"] =
    //         req.body?.other_verified_profiles;
    //     }
    //     const result = await Profile.updateOne(
    //       {
    //         user: isExistUser?._id.toString(),
    //       },
    //       { $set: updateData },
    //       { new: false }
    //     );
    //     res.status(200).json({
    //       status: 200,
    //       success: true,
    //       message: "Verification Request Success",
    //     });
    //   }
    // } else {
    //   return res.status(404).json({
    //     status: 404,
    //     success: false,
    //     message: "User not Found!",
    //   });
    // }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "Verification Request Failed!",
      error_message: error.message,
    });
  }
};

const updateBrandTabInfo = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user?._id);
    if (isExistUser) {
      if (isExistUser?.verification_status === false) {
        return res.status(201).json({
          status: 201,
          success: false,
          type: "verification",
          message: "Profile is Not Verified",
        });
      } else {
        const profileData = {};
        if (req.file) {
          profileData["official_banner"] = req.file?.path;
        }
        if (req.body.name) {
          await updateUserWithSetMethod(
            { name: req.body.name },
            isExistUser?._id.toString()
          );
        }
        await updateProfileBySetMethod(
          profileData,
          isExistUser?._id.toString()
        );
        if (req.file) {
          await removeFile(isExistUser?.profile?.official_banner);
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: "Profile Update Successfully",
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User not Found!",
        data: null,
      });
    }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "Profile Update Failed!",
      error_message: error.message,
    });
  }
};

const approvedProfile = async (req, res) => {
  try {
    const result = await Profile.updateOne(
      {
        verification_status: "Pending",
        _id: req.params.id,
      },
      {
        $set: { verification_status: req.body.status },
      },
      { new: false }
    );
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Profile Update Successfully",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "Profile Update Failed!",
      error_message: error.message,
    });
  }
};

const updateProfileSetting = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.params.id);
    if (isExistUser) {
      const profileData = {};
      if (req.files.profile_image) {
        profileData["profile_image"] = req.files.profile_image[0].path;
      }
      if (req.files.banner) {
        profileData["banner"] = req.files.banner[0].path;
      }

      if (Object.entries(profileData).length > 0) {
        await updateProfileBySetMethod(
          profileData,
          isExistUser?._id.toString()
        );
        if (req.files.banner) {
          await removeFile(isExistUser?.profile?.official_banner);
        }
      }

      let settingsData = {};
      if (req.body.messaging) {
        settingsData["messaging"] =
          req.body.messaging === "Enabled" ? true : false;
      }
      if (req.body.nsfw) {
        settingsData["nsfw"] = req.body.nsfw === "Enabled" ? true : false;
      }
      if (req.body.profile_visibility) {
        settingsData["profile_visibility"] =
          req.body.profile_visibility === "Visible" ? true : false;
      }

      if (Object.entries(settingsData).length > 0) {
        await updateSettingsBySetMethod(
          settingsData,
          isExistUser?._id.toString()
        );
      }

      const result = await getUserInfoById(isExistUser?._id.toString());

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Profile Update Successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User not Found!",
        data: null,
      });
    }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "Profile Update Failed!",
      error_message: error.message,
    });
  }
};

const modifyProfileInformation = async (req, res) => {
  try {
    let socials = null;
    if (req.body.socials) {
      socials = req.body.socials;
    }
    const isExistUser = await getUserInfoById(req.params.id);
    if (isExistUser) {
      const profileData = {};
      if (socials) {
        profileData["socials"] = socials;
      }
      profileData["bio"] = req.body.bio || "";
      await updateProfileBySetMethod(profileData, isExistUser?._id.toString());
      const result = await getUserInfoById(isExistUser?._id.toString());
      return res.status(200).json({
        status: 200,
        success: true,
        message: "User info Update Successfully",
        data: result,
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        type: "email",
        message: "User not Found!",
        data: null,
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
  verificationRequest,
  updateBrandTabInfo,
  approvedProfile,
  updateProfileSetting,
  modifyProfileInformation,
};
