const { sendContactMessage } = require("../../helpers/sendEmailHelper");

const sendMessage = async (req, res) => {
  try {
    const result = await sendContactMessage(req.body);
    if (result) {
      res.status(200).json({
        status: 200,
        success: true,
        message: "Message Send Success",
        data: result,
      });
    } else {
      res.status(201).json({
        status: 201,
        success: false,
        message: "Message Send Failed",
      });
    }
  } catch (error) {
    res.status(201).json({
      status: false,
      error_message: error.message,
      message: "Message Send Failed",
    });
  }
};

module.exports = {
  sendMessage,
};
