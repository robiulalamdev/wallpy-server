const { Schema, model } = require("mongoose");

const reportSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Report = model("Report", reportSchema);
module.exports = Report;
