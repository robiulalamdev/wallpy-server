const Profile = require("../profile/profile.model");
const { updateProfileBySetMethod } = require("../profile/profile.service");
const { ROLE_DATA } = require("../user/user.constants");
const {
  getUserById,
  updateUserWithSetMethod,
} = require("../user/user.service");
const Verification = require("./verification.model");

const createVerificationRequest = async (req, res) => {
  try {
    const userId = req.user?._id;
    const isExist = await getUserById(userId);
    if (isExist) {
      const isExistVerify = await Verification.findOne({ status: "Pending" });
      if (isExistVerify) {
        return res.status(200).json({
          status: 200,
          success: false,
          type: "exist",
          message: "Already Verification Requested",
        });
      } else {
        const newVerification = new Verification({
          user: userId,
          name: req.body.name,
          type: req.body.type,
          links: req.body?.links || [],
          proof_of_identity: req.file?.path,
        });
        const result = await newVerification.save();
        res.status(200).json({
          success: false,
          message: "Verification Request created successfully",
          data: result,
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        type: "type",
        message: "User not Found!",
      });
    }
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Operation Failed",
      errorMessage: error.message,
    });
  }
};

const getTotalVerificationRequests = async (req, res) => {
  try {
    const result = await Verification.countDocuments({ status: "Pending" });
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Verifications retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Verifications retrieve unSuccessfully",
      errorMessage: error.message,
    });
  }
};

const getVerifications = async (req, res) => {
  try {
    const result = await Verification.find({ status: "Pending" })
      .sort({
        _id: -1,
      })
      .populate("user", "username name role")
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            const profile = await Profile.findOne({
              user: currentItem?.user?._id,
            }).select("profile_image");
            return {
              ...currentItem.toObject(),
              title: `has requested ${currentItem?.type} verification.`,
              profile: profile,
            };
          })
        );
        return populatedFeatured;
      });
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Verifications retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Verifications retrieve unSuccessfully",
      errorMessage: error.message,
    });
  }
};

const getReviewedVerifications = async (req, res) => {
  try {
    const result = await Verification.find({
      $or: [{ status: "Dismiss" }, { status: "Granted" }],
    })
      .sort({
        _id: -1,
      })
      .populate("user", "username name role")
      .then(async function (items) {
        const populatedFeatured = await Promise.all(
          items.map(async (currentItem) => {
            const profile = await Profile.findOne({
              user: currentItem?.user?._id,
            }).select("profile_image");
            return {
              ...currentItem.toObject(),
              title: `has requested ${currentItem?.type} verification.`,
              profile: profile,
            };
          })
        );
        return populatedFeatured;
      });
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Verifications retrieve successfully",
      data: result,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "Verifications retrieve unSuccessfully",
      errorMessage: error.message,
    });
  }
};

const modifyVerificationRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const isExistVerify = await Verification.findOne({ _id: id });
    if (isExistVerify) {
      if (req.body.status === "Dismiss") {
        const result = await Verification.updateOne(
          { _id: id },
          { $set: { status: "Dismiss" } },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          message: "Verification request dismiss successfully",
          data: result,
        });
      }
      if (req.body.status === "Granted") {
        const result = await Verification.updateOne(
          { _id: id },
          { $set: { status: "Granted" } },
          { new: true }
        );
        await updateUserWithSetMethod(
          {
            role: isExistVerify?.type,
            name: isExistVerify?.name,
            verification_status: true,
          },
          isExistVerify?.user
        );
        await updateProfileBySetMethod(
          {
            links: isExistVerify?.links || [],
            proof_of_identity: isExistVerify?.proof_of_identity,
          },
          isExistVerify?.user
        );
        return res.status(200).json({
          success: true,
          message: "Verification request granted successfully",
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

module.exports = {
  createVerificationRequest,
  getTotalVerificationRequests,
  getVerifications,
  getReviewedVerifications,
  modifyVerificationRequest,
};
