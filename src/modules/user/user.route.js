const express = require("express");
const {
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
  allUsersInfo,
  addUser,
  removeUsersByIds,
  modifyUserInfo,
  changePasswordFromDashboard,
  updateLoginInformation,
  modifyPrivilegesInfo,
  getMediaArtistInfoByUsername,
} = require("./user.controller");
const { isAuth, isAuthenticated } = require("../../middlewares/auth");
const { upload, handleMulterError } = require("../../config/multer");
const { ROLE_DATA } = require("./user.constants");
const { testAction } = require("./user.service");
const User = require("./user.model");
const router = express.Router();

router.post("/signup", createUser);
router.post("/email-verify/:token", verifyEmail);
router.post("/login", loginUser);
router.get("/me", isAuth, getUserInfo);
router.get("/profile/:username", getPublicUserInfo);

// reset password with email
router.post("/reset-password", resetPassword);
router.post("/verify-reset-password/:token", verifyResetPasswordToken);
router.post("/change-password/", changePassword);

// change password with auth token after login
router.patch("/update-password/", isAuth, updatePassword);

// update endpoints
router.patch(
  "/update-profile-tab",
  isAuth,
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  handleMulterError,
  updateProfileTabInfo
);
router.patch("/update-credentials-tab", isAuth, updateCredentialsTabInfo);
router.get("/all", getAllUsers);
router.get("/profile-activity/:id", getProfileActivity);
router.get("/verified-artists", getVerifiedArtists);

//* admin Routes
router.get(
  "/all-users",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  allUsersInfo
);
router.post("/add-user", addUser);
router.delete("/remove-users", removeUsersByIds);
router.patch(
  "/modify-info",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  modifyUserInfo
);
router.patch(
  "/modify-password/:id",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  changePasswordFromDashboard
);
router.patch(
  "/modify/login-info/:id",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  updateLoginInformation
);
router.patch(
  "/modify/privileges-update/:id",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  modifyPrivilegesInfo
);
router.post(
  "/media/artists/:username",
  isAuthenticated([ROLE_DATA.ADMIN, ROLE_DATA.MOD]),
  getMediaArtistInfoByUsername
);

router.get("/test/action", testAction);

router.get("/test/all-static", async (req, res) => {
  try {
    const result = await User.find({});
    res.status(200).json(result);
  } catch (error) {}
});

module.exports = { userRoutes: router };
