const { Schema, model } = require("mongoose");

const collectionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    wallpapers: {
      type: [Schema.Types.ObjectId],
      ref: "Wallpaper",
      required: false,
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

const Collection = model("Collection", collectionSchema);
module.exports = Collection;
