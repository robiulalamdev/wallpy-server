const { Schema, model } = require("mongoose");
const { ROLE_DATA, USER_STATUS } = require("./user.constants");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    role: {
      type: String,
      enum: [ROLE_DATA.USER, ROLE_DATA.ADMIN, ROLE_DATA.MOD, ROLE_DATA.BRAND],
      default: "User",
      required: true,
    },
    verification_status: {
      // this verification status for brand and artist
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
    status: {
      type: String,
      enum: [USER_STATUS.ACTIVE, USER_STATUS.SUSPENDED, USER_STATUS.BANNED],
      default: USER_STATUS.ACTIVE,
      required: true,
    },
    reason: {
      type: Object,
      message: {
        type: String,
        required: false,
      },
      time: {
        type: String,
        required: false,
      },
      required: false,
    },
    verified: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: true,
    },
    provider: {
      type: String,
      enum: ["Manual", "Google", "Facebook", "Apple"],
      default: "Manual",
      required: true,
    },
    reset_password: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
    reset_email: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
    warnings: {
      type: String,
      required: false,
    },
    lastActive: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    timeseries: true,
  }
);

const User = model("User", userSchema);
module.exports = User;
