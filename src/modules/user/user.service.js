const User = require("./user.model");

const getUser = async (email) => {
  const result = await User.findOne({ email: email });
  return result;
};
const getUsername = async (username) => {
  const result = await User.findOne({ username: username });
  return result;
};

module.exports = {
  getUser,
  getUsername,
};
