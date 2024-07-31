const { Schema, model } = require("mongoose");

const featuredSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Wallpaper", "Contact", "Staff", "Credential", "Artist", "Brand"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    targetType: {
      type: String,
      enum: ["User", "Wallpaper"],
      required: true,
    },
    serialNo: {
      type: Number,
      required: false,
    },
  },
  { timeseries: true, timestamps: true }
);

const Featured = model("Featured", featuredSchema);
module.exports = Featured;
