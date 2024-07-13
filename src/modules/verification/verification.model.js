const { Schema, model } = require("mongoose");
const { ROLE_DATA } = require("../user/user.constants");

const verificationSchema = new Schema(
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
    type: {
      type: String,
      enum: [ROLE_DATA.BRAND, ROLE_DATA.ARTIST],
      required: true,
    },
    links: {
      type: [String],
      required: false,
    },
    proof_of_identity: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Dismiss", "Granted"],
      default: "Pending",
      required: true,
    },
  },
  {
    timestamps: true,
    timeseries: true,
  }
);

const Verification = model("Verification", verificationSchema);
module.exports = Verification;
