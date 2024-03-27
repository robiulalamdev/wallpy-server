const User = require("./user.model");
const { getUsername, getUser } = require("./user.service");

const createUser = async (req, res) => {
  try {
    const isExistUser = await getUser(req.body.email);
    const isExistUsername = await getUsername(req.body.username);
    console.log(isExistUser);
    // req.body["name"] = req.body.email.split("@")[0];
    // const newUser = new User(req.body);
    // const result = await newUser.save();
    res.status(200).json({
      status: 200,
      success: true,
      message: "User Create Success",
    });
  } catch (error) {
    res.status(201).json({
      status: 201,
      success: false,
      message: "User Create Failed!",
      error_message: error.message,
    });
  }
};

module.exports = {
  createUser,
};
