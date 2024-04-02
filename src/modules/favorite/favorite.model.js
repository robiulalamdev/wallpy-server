const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wallpaper: {
      type: Schema.Types.ObjectId,
      ref: "Wallpaper",
      required: true,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
      required: true,
    },
  },
  { timeseries: true, timestamps: true }
);

const Favorite = model("Favorite", favoriteSchema);
module.exports = Favorite;
