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
    hide: {
      type: Object,
      sender: {
        type: Boolean,
        enum: [true, false],
      },
      receiver: {
        type: Boolean,
        enum: [true, false],
      },
      default: { sender: false, receiver: false },
      required: false,
    },
  },
  { timeseries: true, timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
