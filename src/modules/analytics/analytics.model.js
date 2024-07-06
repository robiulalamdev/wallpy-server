const { Schema, model } = require("mongoose");

const analyticsSchema = new Schema(
  {
    visitors: {
      type: [String], //* ip address stored in array
      required: false,
    },
  },
  { timeseries: true, timestamps: true }
);

const Analytics = model("Analytics", analyticsSchema);
module.exports = Analytics;
