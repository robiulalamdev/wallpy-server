const { getLocation } = require("../../helpers/services");
const Profile = require("../profile/profile.model");
const Settings = require("../settings/settings.model");
const { WALLPAPER_ENUMS } = require("../wallpaper/wallpaper.constant");
const Wallpaper = require("../wallpaper/wallpaper.model");
const User = require("./user.model");
const bcrcypt = require("bcryptjs");

const createNewUser = async (data, ip) => {
  const newUser = new User({
    name: data.email.split("@")[0],
    password: bcrcypt.hashSync(data.password),
    email: data?.email,
    username: data?.username,
    verified: false,
  });
  const location = await getLocation(ip);
  const result = await newUser.save();
  if (result) {
    const newProfile = new Profile({
      user: result?._id.toString(),
      country: location?.country,
      countryCode: location?.countryCode,
      zip: location?.zip,
      flag: location?.flag,
    });
    const newSettings = new Settings({ user: result?._id.toString() });
    const settingsResult = await newSettings.save();
    const profileResult = await newProfile.save();
    return result;
  }
};

const getUser = async (email) => {
  const result = await User.findOne({ email: email });
  return result;
};

const getUserByUsername = async (username) => {
  const result = await User.findOne({ username: username });
  return result;
};

const getUserWithPassword = async (email) => {
  const result = await User.findOne({ email: email }).select("+password");
  return result;
};

const getUserByIdWithPassword = async (id) => {
  const result = await User.findOne({ _id: id }).select("+password");
  return result;
};

const getUserInfoById = async (id) => {
  const result = await User.findOne({ _id: id });
  if (result) {
    const profile = await Profile.findOne({ user: id });
    const settings = await Settings.findOne({ user: id });
    return { ...result.toObject(), profile: profile, settings: settings };
  } else {
    return null;
  }
};

const getUserInfoByUsername = async (username) => {
  const result = await User.findOne({ username: username });
  if (result) {
    const profile = await Profile.findOne({ user: result?._id.toString() });
    const settings = await Settings.findOne({ user: result?._id.toString() });
    return { ...result.toObject(), profile: profile, settings: settings };
  } else {
    return null;
  }
};

const getUsername = async (username) => {
  const result = await User.findOne({ username: username });
  return result;
};

const getUserById = async (id) => {
  const result = await User.findById({ _id: id });
  return result;
};

const getUserAndProfileById = async (id) => {
  const result = await User.findById({ _id: id }).select(
    "username name email role"
  );
  const profile = await Profile.findOne({
    user: result?._id.toString(),
  }).select("profile_image");
  return { ...result.toObject(), profile_image: profile?.profile_image };
};

const getUserByEmail = async (email) => {
  const result = await User.findOne({ email: email });
  return result;
};

const updateUserWithSetMethod = async (data, id) => {
  const result = await User.findByIdAndUpdate(
    { _id: id },
    {
      $set: data,
    },
    { new: false }
  );
  return result;
};

const updateLastActive = async (data, id) => {
  const result = await User.findByIdAndUpdate(
    { _id: id },
    {
      $set: data,
    },
    { new: false }
  );
  return result;
};

module.exports = {
  createNewUser,
  getUser,
  getUserWithPassword,
  getUsername,
  getUserInfoById,
  getUserByUsername,
  updateUserWithSetMethod,
  getUserByIdWithPassword,
  getUserByEmail,
  getUserInfoByUsername,
  getUserById,
  getUserAndProfileById,
  updateLastActive,
};
