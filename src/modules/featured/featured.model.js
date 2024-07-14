const { Schema, model } = require("mongoose");

const featuredSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Contact", "Staff", "Credential", "Artist", "Brand"],
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
  },
  { timeseries: true, timestamps: true }
);

const Featured = model("Featured", featuredSchema);
module.exports = Featured;
