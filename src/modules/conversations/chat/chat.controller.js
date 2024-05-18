const User = require("../../user/user.model");
const { getUserAndProfileById } = require("../../user/user.service");
const Message = require("../message/message.model");
const Chat = require("./chat.model");

const createChat = async (req, res) => {
  try {
    const isExist = await Chat.findOne({
      members: {
        $all: req.body.members,
      },
    });
    if (isExist) {
      const newMessage = new Message({
        chatId: isExist?._id,
        senderId: req.user?._id,
        members: req.body.members,
        message: req.body.message,
      });
      const result = await newMessage.save();
      res.status(200).json({
        success: true,
        message: "Message Send Successfully",
        data: result,
      });
    } else {
      const newChat = new Chat(req.body);
      const chatResult = await newChat.save();
      const newMessage = new Message({
        chatId: chatResult?._id,
        senderId: req.user?._id,
        members: req.body.members,
        message: req.body.message,
      });
      const result = await newMessage.save();
      res.status(200).json({
        success: true,
        message: "Message Send Successfully",
        data: result,
      });
    }
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Message Send unSuccessfully",
      error_message: error.message,
    });
  }
};

const getAllChats = async (req, res) => {
  try {
    const userId = req.user?._id;
    const chats = await Chat.find({
      members: { $all: [userId] },
    });
    const formattedChats = [];
    for (const chat of chats) {
      const receiverId =
        chat?.members[0].toString() === userId
          ? chat?.members[1]
          : chat?.members[0];
      const receiverInfo = await getUserAndProfileById(receiverId);
      const lastMessage = await Message.findOne({ chatId: chat._id })
        .sort({
          createdAt: -1,
        })
        .select("message createdAt isSeen chatId");

      const total = await Message.countDocuments({
        $and: [
          { chatId: chat?._id },
          { senderId: { $ne: userId } },
          { isSeen: false },
        ],
      });
      const formattedChat = {
        ...chat.toObject(),
        receiverInfo: receiverInfo,
        lastMessage: lastMessage,
        total_unseen: total,
      };

      formattedChats.push(formattedChat);
    }

    formattedChats.sort((a, b) => {
      const dateA = new Date(b.lastMessage?.createdAt);
      const dateB = new Date(a.lastMessage?.createdAt);
      return dateA - dateB;
    });
    res.status(200).json({
      success: true,
      message: "Chats Retrieve Successfully",
      data: formattedChats,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Chats Retrieve unSuccessfully",
      error_message: error.message,
    });
  }
};

module.exports = {
  createChat,
  getAllChats,
};
