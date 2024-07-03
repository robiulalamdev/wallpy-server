const { Schema, model } = require("mongoose");

const analyticsSchema = new Schema(
  {
    visitors: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  { timeseries: true, timestamps: true }
);

const Analytics = model("Analytics", analyticsSchema);
module.exports = Analytics;
