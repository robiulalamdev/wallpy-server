const {
  generateVerifyToken,
  decodeToken,
  generateToken,
} = require("../../helpers/jwtHelper");
const { sendVerifyEmail } = require("../../helpers/sendEmailHelper");
const User = require("./user.model");
const {
  getUsername,
  getUser,
  createNewUser,
  getUserWithPassword,
  getUserInfoById,
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
          success: true,
          message:
            "This Email have an account and account is unverified. Please check your email, and verify your email address",
        });
      }
    } else {
      const isExistUsername = await getUsername(req.body.username);
      if (isExistUsername) {
        return res.status(200).json({
          status: 200,
          success: true,
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
        message: "Email Verification Success",
        data: result,
      });
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
          return res.status(200).json({
            status: 200,
            success: true,
            message: "User Login Success",
            data: { accessToken: accessToken },
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
          success: true,
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

module.exports = {
  createUser,
  verifyEmail,
  loginUser,
};
