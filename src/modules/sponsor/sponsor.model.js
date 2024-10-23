const { Schema, model } = require("mongoose");

const sponsorSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Main", "Official", "Trending"],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
