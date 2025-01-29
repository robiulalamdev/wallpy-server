const { Schema, model } = require("mongoose");

const trendingSchema = new Schema(
  {
    wallpapers: {
      type: [Schema.Types.ObjectId],
      ref: "Wallpaper",
      default: [],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    timeseries: true,
  }
);

const Trending = model("Trending", trendingSchema);
module.exports = Trending;
