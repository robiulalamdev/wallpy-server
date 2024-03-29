const { Schema, model } = require("mongoose");

const userProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    profile_image: {
      type: String,
      required: false,
    },
    banner: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    timeseries: true,
  }
);

const Profile = model("Profile", userProfileSchema);
module.exports = Profile;
