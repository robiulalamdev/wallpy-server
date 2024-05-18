const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    senderId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId, // 1. Receiver 2. Sender
        ref: "User",
        required: true,
      },
    ],
    message: {
      type: String,
      required: false,
    },
    isSeen: {
      type: Boolean,
      enum: [true, false],
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
