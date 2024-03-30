const Profile = require("./profile.model");

const updateProfileBySetMethod = async (data, id) => {
  const result = await Profile.updateOne(
    { user: id },
    {
      $set: data,
    },
    { new: false }
  );
  return result;
};

module.exports = {
  updateProfileBySetMethod,
};
