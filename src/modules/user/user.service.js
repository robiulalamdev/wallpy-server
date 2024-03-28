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
  return result;
};

const getUser = async (email) => {
  const result = await User.findOne({ email: email });
  return result;
};

const getUserWithPassword = async (email) => {
  const result = await User.findOne({ email: email }).select("+password");
  return result;
};

const getUserInfoById = async (id) => {
  const result = await User.findOne({ _id: id });
  return result;
};

const getUsername = async (username) => {
  const result = await User.findOne({ username: username });
  return result;
};

module.exports = {
  createNewUser,
  getUser,
  getUserWithPassword,
  getUsername,
  getUserInfoById,
};
