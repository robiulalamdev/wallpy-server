const { removeFile } = require("../../config/multer");
const {
  generateVerifyToken,
  decodeToken,
  generateToken,
} = require("../../helpers/jwtHelper");
const {
  sendVerifyEmail,
  sendForgotPasswordMail,
} = require("../../helpers/sendEmailHelper");
const Profile = require("../profile/profile.model");
const { updateProfileBySetMethod } = require("../profile/profile.service");
const Wallpaper = require("../wallpaper/wallpaper.model");
const User = require("./user.model");
const {
  getUsername,
  getUser,
  createNewUser,
  getUserWithPassword,
  getUserInfoById,
  getUserByUsername,
  updateUserWithSetMethod,
  getUserByIdWithPassword,
  getUserByEmail,
  getUserInfoByUsername,
} = require("./user.service");
const bcrcypt = require("bcryptjs");

const createUser = async (req, res) => {
  try {
    const isExistUser = await getUser(req.body.email);
    if (isExistUser) {
      if (isExistUser?.verified) {
        res.status(201).json({
          status: 201,
          success: false,
          type: "email",
          message: "Email already in use",
        });
      } else {
        const token = await generateVerifyToken({
          email: isExistUser?.email,
          username: isExistUser?.username,
          _id: isExistUser?._id,
        });
        await sendVerifyEmail(isExistUser, token);
        res.status(200).json({
          status: 200,
          success: false,
          type: "unverified",
          message:
            "This Email have an account and account is unverified. Please check your email, and verify your email address",
        });
      }
    } else {
      const isExistUsername = await getUsername(req.body.username);
      if (isExistUsername) {
        return res.status(200).json({
          status: 200,
          success: false,
          type: "username",
          message: "Username already in use",
        });
      } else {
        const createResult = await createNewUser(req.body);
        const token = await generateVerifyToken({
          email: createResult?.email,
          username: createResult?.username,
          _id: createResult?._id,
        });
        await sendVerifyEmail(createResult, token);
        res.status(200).json({
          status: 200,
          success: true,
          type: "verify",
          message: "Please check your email, and verify your email address",
        });
      }
    }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Create Failed!",
      error_message: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const tokenUser = await decodeToken(req.params.token);
    if (tokenUser?.success) {
      const user = await getUser(tokenUser?.data?.email);
      if (user) {
        if (user?.verified) {
          return res.status(200).json({
            status: 200,
            success: true,
            message: "Email Already Verified",
          });
        } else {
          const result = await User.findByIdAndUpdate(
            {
              _id: tokenUser?.data?._id,
              email: tokenUser?.data?.email,
            },
            {
              $set: {
                verified: true,
              },
            },
            { new: true }
          );
          res.status(200).json({
            status: 200,
            success: true,
            message:
              "Welcome! Your email has been successfully verified. Thank you for completing your registration and joining the society!",
            data: result,
          });
        }
      } else {
        res.status(404).json({
          status: 404,
          success: false,
          type: "email",
          message: "Account Not Found!",
        });
      }
    } else {
      res.status(200).json({
        status: 201,
        success: false,
        message: "Verification is Expired!. please try again",
      });
    }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Verification Failed!",
      error_message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const isExistUser = await getUserWithPassword(req.body.email);
    if (isExistUser) {
      if (isExistUser?.verified) {
        if (bcrcypt.compareSync(req.body.password, isExistUser.password)) {
          const accessToken = await generateToken({
            email: isExistUser?.email,
            username: isExistUser?.username,
            verified: isExistUser?.verified,
            _id: isExistUser?._id,
          });
          const user = await getUserInfoById(isExistUser?._id?.toString());
          return res.status(200).json({
            status: 200,
            success: true,
            message: "User Login Success",
            data: { accessToken: accessToken, user: user },
          });
        } else {
          return res.status(201).json({
            status: 201,
            success: false,
            type: "password",
            message: "Incorrect Password",
          });
        }
      } else {
        const token = await generateVerifyToken({
          email: isExistUser?.email,
          username: isExistUser?.username,
          _id: isExistUser?._id,
        });
        await sendVerifyEmail(isExistUser, token);
        res.status(200).json({
          status: 200,
          type: "unverified",
          success: false,
          message:
            "This Email have an account and account is unverified. Please check your email, and verify your email address",
        });
      }
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
      message: "User Login Failed!",
      error_message: error.message,
    });
  }
};

// forgot password step 1
const resetPassword = async (req, res) => {
  try {
    const isExistUser = await getUser(req.body.email);
    if (isExistUser) {
      const token = await generateVerifyToken({
        email: isExistUser?.email,
        username: isExistUser?.username,
        _id: isExistUser?._id,
      });
      await sendForgotPasswordMail(isExistUser, token);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Please check your email, and Reset Your Password",
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
      message: "Operation Failed. please try again!",
      error_message: error.message,
    });
  }
};

// forgot password step 2
const verifyResetPasswordToken = async (req, res) => {
  try {
    const tokenUser = await decodeToken(req.params.token);
    if (tokenUser?.success) {
      const user = await getUser(tokenUser?.data?.email);
      if (user) {
        const result = await User.findByIdAndUpdate(
          {
            _id: tokenUser?.data?._id,
          },
          {
            $set: {
              reset_password: true,
            },
          },
          { new: false }
        );
        res.status(200).json({
          status: 200,
          success: true,
          message: "Your Password Reset",
          data: { email: result?.email },
        });
      } else {
        res.status(404).json({
          status: 404,
          success: false,
          type: "email",
          message: "User Not Found!",
        });
      }
    } else {
      res.status(201).json({
        status: 201,
        success: false,
        type: "token",
        message: "Verification is Expired!. please try again",
      });
    }
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Verification Failed!",
      error_message: error.message,
    });
  }
};

// forgot password step 3
const changePassword = async (req, res) => {
  try {
    const isExistUser = await getUser(req.body.email);
    if (isExistUser) {
      if (isExistUser?.reset_password) {
        const result = await User.findByIdAndUpdate(
          {
            _id: isExistUser?._id.toString(),
          },
          {
            $set: {
              password: bcrcypt.hashSync(req.body.password),
              reset_password: false,
            },
          },
          { new: false }
        );
        res.status(200).json({
          status: 200,
          success: true,
          message: "Password Changed Success",
        });
      } else {
        res.status(200).json({
          status: 200,
          success: false,
          type: "password",
          message: "Please Reset Password. before Change password",
        });
      }
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
      message: "User Login Failed!",
      error_message: error.message,
    });
  }
};

// forgot password step 1
// const forgotEmail = async (req, res) => {
//   try {
//     const isExistUser = await getUserByUsername(req.body.email);
//     if (isExistUser) {
//       const token = await generateVerifyToken({
//         email: isExistUser?.email,
//         username: isExistUser?.username,
//         _id: isExistUser?._id,
//       });
//       await sendForgotPasswordMail(isExistUser, token);
//       res.status(200).json({
//         status: 200,
//         success: true,
//         message: "Please check your email, and Reset Your Password",
//       });
//     } else {
//       return res.status(404).json({
//         status: 404,
//         success: false,
//         type: "email",
//         message: "User not Found!",
//       });
//     }
//   } catch (error) {
//     res.status(201).json({
//       status: 201,
//       success: false,
//       message: "Operation Failed!",
//       error_message: error.message,
//     });
//   }
// };

const updatePassword = async (req, res) => {
  try {
    const isExistUser = await getUserByIdWithPassword(req.user?._id);
    if (isExistUser) {
      if (
        bcrcypt.compareSync(req.body.current_password, isExistUser.password)
      ) {
        const result = await User.findByIdAndUpdate(
          {
            _id: isExistUser?._id.toString(),
          },
          {
            $set: {
              password: bcrcypt.hashSync(req.body.new_password),
            },
          },
          { new: false }
        );
        res.status(200).json({
          status: 200,
          success: true,
          message: "Password Changed Success",
        });
      } else {
        return res.status(201).json({
          status: 201,
          success: false,
          type: "password",
          message: "Incorrect Password",
        });
      }
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
      message: "User Login Failed!",
      error_message: error.message,
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user?._id);
    if (isExistUser) {
      res.status(200).json({
        status: 200,
        success: true,
        message: "User Retrieve Success",
        data: isExistUser,
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
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

// get user info by username
const getPublicUserInfo = async (req, res) => {
  try {
    const isExistUser = await getUserInfoByUsername(req.params.username);
    if (isExistUser) {
      res.status(200).json({
        status: 200,
        success: true,
        message: "User Retrieve Success",
        data: isExistUser,
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
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

const updateProfileTabInfo = async (req, res) => {
  try {
    let socials = null;
    if (req.body.socials) {
      socials = JSON.parse(req.body.socials);
    }
    const isExistUser = await getUserInfoById(req.user?._id);
    if (isExistUser) {
      const isExistUsername = await getUserByUsername(req.body.username);
      if (
        isExistUsername &&
        isExistUsername?._id.toString() !== isExistUser?._id?.toString()
      ) {
        return res.status(200).json({
          status: 200,
          success: false,
          type: "username",
          message: "Username already in use",
        });
      } else {
        const profileData = {};
        if (socials) {
          profileData["socials"] = socials;
        }
        if (req.files.profile_image) {
          profileData["profile_image"] = req.files.profile_image[0].path;
        }
        if (req.files.banner) {
          profileData["banner"] = req.files.banner[0].path;
        }
        if (req.body.bio) {
          profileData["bio"] = req.body.bio;
        }
        const updateObject = { username: req.body.username };
        await updateUserWithSetMethod(
          updateObject,
          isExistUser?._id.toString()
        );
        await updateProfileBySetMethod(
          profileData,
          isExistUser?._id.toString()
        );
        if (req.files.banner) {
          await removeFile(isExistUser?.profile?.banner);
        }
        if (req.files.profile_image) {
          await removeFile(isExistUser?.profile?.profile_image);
        }
        return res.status(200).json({
          status: 200,
          success: true,
          message: "User info Update Successfully",
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
      message: "User Retrieve Failed!",
      error_message: error.message,
    });
  }
};

// update credentials tab info
const updateCredentialsTabInfo = async (req, res) => {
  try {
    const isExistUser = await getUserInfoById(req.user?._id);
    if (isExistUser) {
      const updateData = {};
      if (req.body?.new_password && req.body?.current_password) {
        updateData["password"] = bcrcypt.hashSync(req.body.new_password);
      }
      if (req.body?.warnings) {
        updateData["warnings"] = req.body?.warnings;
      }
      if (req.body?.email) {
        const isExistMail = await getUserByEmail(req.body?.email);
        if (
          isExistMail &&
          isExistMail?._id.toString() !== isExistUser?._id?.toString()
        ) {
          updateData["email"] = req.body?.email;
          return res.status(201).json({
            status: 201,
            success: false,
            type: "email",
            message: "Email already in use!",
          });
        }
      }
      const result = await User.findByIdAndUpdate(
        {
          _id: isExistUser?._id.toString(),
        },
        {
          $set: updateData,
        },
        { new: false }
      );
      res.status(200).json({
        status: 200,
        success: true,
        message: "Information update successfully",
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ verified: true }).sort({ _id: -1 });
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ user: user._id });
        return {
          ...user.toObject(),
          profile: profile ? profile.toObject() : null,
        };
      })
    );

    // Return the combined data
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Users and profiles retrieved successfully",
      data: usersWithProfiles,
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Retrieve Failed!",
      error_message: error.message,
    });
  }
};

const getProfileActivity = async (req, res) => {
  try {
    const result = await Wallpaper.countDocuments({
      user: req.params.id,
      status: "Published",
    });

    const lastActive = await Wallpaper.findOne({ user: req.params.id })
      .sort({ _id: -1 })
      .limit(1)
      .populate({ path: "user", select: "createdAt" })
      .select("createdAt user");

    // Return the combined data
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Profile Activity retrieved successfully",
      data: {
        uploadTotal: result,
        lastActive: lastActive?.createdAt,
        memberSince: lastActive?.user?.createdAt,
      },
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "Profile Activity Retrieve Failed!",
      error_message: error.message,
    });
  }
};

const getVerifiedArtists = async (req, res) => {
  try {
    const result = await Profile.find({
      profile_type: "Artist",
      $or: [
        { verification_status: "Approved" },
        // { verification_status: "Pending" },
      ],
    })
      .select("profile_image verification_status name profile_type -_id")
      .populate("user", "name username")
      .sort({ _id: -1 })
      .limit(5);

    const artists = result.map((profile) => {
      return {
        ...profile?.user.toObject(),
        profile: { ...profile.toObject(), user: profile?.user?._id },
      };
    });

    // Return the combined data
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Verified Artists Retrieved successfully",
      data: artists,
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "Verified Artists Retrieve Failed!",
      error_message: error.message,
    });
  }
};

module.exports = {
  createUser,
  verifyEmail,
  loginUser,
  resetPassword,
  verifyResetPasswordToken,
  changePassword,
  updatePassword,
  getUserInfo,
  updateProfileTabInfo,
  updateCredentialsTabInfo,
  getPublicUserInfo,
  getAllUsers,
  getProfileActivity,
  getVerifiedArtists,
};
