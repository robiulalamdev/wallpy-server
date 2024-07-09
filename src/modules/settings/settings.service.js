const Settings = require("./settings.model");

const updateSettingsBySetMethod = async (data, id) => {
  const result = await Settings.updateOne(
    { user: id },
    {
      $set: data,
    },
    { new: false }
  );
  return result;
};

module.exports = {
  updateSettingsBySetMethod,
};
