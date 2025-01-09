const { Schema, model } = require("mongoose");

const socialSchema = new Schema(
  {
    twitter: {
      type: String,
      required: false,
    },
    behance: {
      type: String,
      required: false,
    },
    dribbble: {
      type: String,
      required: false,
    },
    instagram: {
      type: String,
      required: false,
    },
    discord: {
      type: String,
      required: false,
    },
    threads: {
      type: String,
      required: false,
    },
    reddit: {
      type: String,
      required: false,
    },
    twitch: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const userProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profile_image: {
      type: String,
      default: "src/assets/images/profile/profile.png",
      required: false,
    },
    banner: {
      type: String,
      default: "src/assets/images/profile/banner.png",
      required: false,
    },
    official_banner: {
      type: String,
      default: "src/assets/images/profile/banner.png",
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    links: {
      type: [String],
      required: false,
    },
    proof_of_identity: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    countryCode: {
      type: String,
      required: false,
    },
    flag: {
      type: String,
      required: false,
    },
    ip: {
      type: String,
      default: "0.0.0.0",
      required: false,
    },
    zip: {
      type: Number,
      required: false,
    },
    socials: {
      type: socialSchema,
      default: {
        twitter: "",
        behance: "",
        dribbble: "",
        instagram: "",
        discord: "",
        threads: "",
        reddit: "",
        twitch: "",
      },
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
