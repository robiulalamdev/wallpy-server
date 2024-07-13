const { Schema, model } = require("mongoose");
const { REPORT_TYPES } = require("./report.constants");

const reportSchema = new Schema(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        REPORT_TYPES.USER_REPORT,
        REPORT_TYPES.REMOVAL_REQUEST,
        REPORT_TYPES.CLAIM_REQUEST,
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Dismiss", "Reviewed"],
      default: "Pending",
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
