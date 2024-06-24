const { Schema, model } = require("mongoose");
const { WALLPAPER_ENUMS } = require("./wallpaper.constant");
const shortid = require("shortid");

const wallpaperSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: WALLPAPER_ENUMS.STATUS,
      default: WALLPAPER_ENUMS.STATUS[0],
      required: true,
    },
    wallpaper: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    type: {
      type: String,
      enum: WALLPAPER_ENUMS.TYPES,
      required: false,
    },
    classification: {
      type: String,
      enum: WALLPAPER_ENUMS.CLASSIFICATION,
      required: false,
    },
    screen_type: {
      type: String,
      enum: WALLPAPER_ENUMS.SCREEN_TYPE,
      required: false,
    },
    dimensions: {
      type: Object,
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    view: {
      type: Number,
      default: 0,
      required: true,
    },
    tags: {
      type: [String],
      index: true,
      required: false,
    },
    source: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false,
    },
  },
  { timeseries: true, timestamps: true }
);

const Wallpaper = model("Wallpaper", wallpaperSchema);
module.exports = Wallpaper;
