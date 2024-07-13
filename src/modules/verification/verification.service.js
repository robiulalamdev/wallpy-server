const Verification = require("./verification.model");

const getVerificationByUserId = async (userId) => {
  const result = await Verification.findOne({
    user: userId,
    // status: "Pending",
  }).sort({ _id: -1 });

  return result;
};

module.exports = {
  getVerificationByUserId,
};
