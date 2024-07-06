const { Schema, model } = require("mongoose");

const damMessageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
  },
  { timeseries: true, timestamps: true }
);

const DamMessage = model("DamMessage", damMessageSchema);
module.exports = DamMessage;
