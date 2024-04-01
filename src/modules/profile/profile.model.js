const { Schema, model } = require("mongoose");

const userProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profile_image: {
      type: String,
      required: false,
    },
    banner: {
      type: String,
      required: false,
    },
    official_banner: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    profile_type: {
      type: String,
      enum: ["None", "Brand", "Artist"],
      default: "None",
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    verification_status: {
      type: String,
      enum: ["None", "Pending", "Approved", "Decline"],
      default: "None",
      required: true,
    },
    other_verified_profiles: {
      type: [String],
      required: false,
    },
    proof_of_identity: {
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
