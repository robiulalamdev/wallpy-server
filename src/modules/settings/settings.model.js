const { Schema, model } = require("mongoose");

const userSettingsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
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
      default: true,
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
