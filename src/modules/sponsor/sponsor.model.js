const { Schema, model } = require("mongoose");

const sponsorSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Main"],
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
  },
  { timeseries: true, timestamps: true }
);

const Sponsor = model("Sponsor", sponsorSchema);
module.exports = Sponsor;
