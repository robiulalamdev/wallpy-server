const { Schema, default: mongoose } = require("mongoose");

const chatSchema = new Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId, // 1. Receiver 2. Sender
        ref: "User",
        required: true,
      },
    ],
  },
  { timeseries: true, timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
