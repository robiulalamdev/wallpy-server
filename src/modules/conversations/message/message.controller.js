const Message = require("./message.model");

const createMessage = async (req, res) => {
  try {
    const newMessage = new Message({
      chatId: req.body.chatId,
      senderId: req.user?._id || req.body.senderId,
      members: req.body.members,
      message: req.body.message,
    });
    const result = await newMessage.save();
    res.status(200).json({
      success: true,
      message: "Message Send Successfully",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Message Send unSuccessfully",
      error_message: error.message,
    });
  }
};

const getAllMessagesByChat = async (req, res) => {
  try {
    let query = { chatId: req.params.chatId };
    const result = await Message.find(query);
    res.status(200).json({
      success: true,
      message: "Messages Retrieve Successfully",
      data: result,
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      message: "Messages Retrieve unSuccessfully",
      error_message: error.message,
    });
  }
};

module.exports = {
  createMessage,
  getAllMessagesByChat,
};
