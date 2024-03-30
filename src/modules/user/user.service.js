const Profile = require("../profile/profile.model");
const Settings = require("../settings/settings.model");
const User = require("./user.model");
const bcrcypt = require("bcryptjs");

const createNewUser = async (data) => {
  const newUser = new User({
    name: data.email.split("@")[0],
    password: bcrcypt.hashSync(data.password),
    email: data?.email,
    username: data?.username,
    verified: false,
  });
  const result = await newUser.save();
  if (result) {
    const newProfile = new Profile({ user: result?._id.toString() });
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
  const profile = await Profile.findOne({ user: id });
  const settings = await Settings.findOne({ user: id });
  return { ...result.toObject(), profile: profile, settings: settings };
};

const getUsername = async (username) => {
  const result = await User.findOne({ username: username });
  return result;
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
};
