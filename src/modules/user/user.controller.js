const {
  generateVerifyToken,
  decodeToken,
  generateToken,
} = require("../../helpers/jwtHelper");
const {
  sendVerifyEmail,
  sendForgotPasswordMail,
} = require("../../helpers/sendEmailHelper");
const User = require("./user.model");
const {
  getUsername,
  getUser,
  createNewUser,
  getUserWithPassword,
  getUserInfoById,
  getUserByUsername,
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
    const isExistUser = await getUserWithPassword(req.user?.email);
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

module.exports = {
  createUser,
  verifyEmail,
  loginUser,
  resetPassword,
  verifyResetPasswordToken,
  changePassword,
  updatePassword,
  getUserInfo,
};
