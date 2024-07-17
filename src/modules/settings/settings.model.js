const { Schema, model } = require("mongoose");

const userSettingsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profile_visibility: {
      type: Boolean,
      enum: [true, false],
      default: true,
      required: false,
    },
    messaging: {
      type: Boolean,
      enum: [true, false],
      default: true,
      required: false,
    },
    nsfw: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
    acceptCommunityRules: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
    blacklist_tags: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
    timeseries: true,
  }
);

const Settings = model("Settings", userSettingsSchema);
module.exports = Settings;
