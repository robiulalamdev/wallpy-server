const { Schema, model } = require("mongoose");

const sponsorSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Main", "Official", "Trending"],
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
    clickThrough: {
      type: [Date],
      default: [],
      required: false,
    },
  },
  { timeseries: true, timestamps: true }
);

const Sponsor = model("Sponsor", sponsorSchema);
module.exports = Sponsor;
